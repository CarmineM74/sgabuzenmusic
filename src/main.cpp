#include <Arduino.h>
#include <main.h>
#include <Wire.h>
#include <ESP8266WiFi.h>
#include <ESP8266mDNS.h>
#include <ESP8266WebServer.h>
#include <OneWire.h>
#include <FluentPrint.h>
#include <TimedAction.h>
#include <FiniteStateMachine.h>
#include <ArduinoJson.h>
#include <FS.h>
#include <LED.h>
#include <Button.h>

#define ON                                              true
#define OFF                                             false
#define SECOND                                          1000
#define MINUTE                                          60 * SECOND
#define JSON_BUFFER_SIZE                                1024
#define MAX_PRESETS                                     32
#define AP_NAME                                         "SGABAP"
#define AP_PASSWORD                                     "DEADBEEF"

// Hardware Pinout
// D0 - Used if DeepSleep is required
// D1 - SCL GPIO5
// D2 - SDA GPIO4
// D3 - I2C (Expander, ...)
// D4 - Onboard LED
LED hbLed = LED(D4);

// D5 - NEXT PRESET BUTTON
Button nextBtn = Button(D5, BUTTON_PULLUP_INTERNAL);
// D6 - REWIND TO 0 BUTTON
Button rewindBtn = Button(D6, BUTTON_PULLUP_INTERNAL);
// D7 - PREVIOUS PRESET BUTTON
Button prevBtn = Button(D7, BUTTON_PULLUP_INTERNAL);
// D8 - CS
// A0 -

FluentPrint printer(&Serial);

// Hardware configuration
#define ONE_WIRE_BUS D3
OneWire oneWire(ONE_WIRE_BUS);

// Other configurations
ESP8266WebServer server(80);
String webpage;

String CONFIG_FILE = "/config.json";

// FSM
State Boot = State(boot);
State LoadConfig = State(load_config);
State EnableAP = State(enable_ap);
State InitComplete = State(init_complete);
State FailedToStart = State(failed_to_start);

FSM mainFsm = FSM(Boot);

struct Preset {
  String name;
  byte configuration;
  bool enabled;
};

struct AppState {
  String id;
  String fwVersion;
  String configVersion;
  bool config_file_found;
  bool config_file_loaded;
  bool initComplete;
  bool hbTick;
  bool run;
  bool failedToStart;
  Preset presets[MAX_PRESETS];
  Preset enabledPresets[MAX_PRESETS];
  int currentPreset;
  int presetCount;
  int enabledPresetCount;
};

AppState state;

TimedAction everySecondAction       = TimedAction(1 * SECOND, secondElapsed);

void setup() {
  // Da salvare nel file di configurazione:
  // - fwVersion
  // - configVersion
  // - presetCount
  state.failedToStart = false;
  state.fwVersion = "0.0.0";
  state.configVersion = "0.0.0";
  state.initComplete = false;
  state.config_file_found = false;
  state.config_file_loaded = false;
  state.currentPreset = 0;
  state.presetCount = 0;
  state.enabledPresetCount = 0;
}

void boot() {
  Serial.begin(115200);
  printer.print("Booting V: ")
         .println(state.fwVersion)
         .println("Mounting FS...");
  if (!SPIFFS.begin()) {
    printer.println("Failed to mount file system");
    mainFsm.transitionTo(FailedToStart);
  } else {
    fsDirToSerial();
    mainFsm.transitionTo(LoadConfig);
  }
}

void fsDirToSerial() {
  Dir dir = SPIFFS.openDir("/");
  String output = "[";
  while(dir.next()){
    File entry = dir.openFile("r");
    if (output != "[") output += ',';
    bool isDir = false;
    output += "{\"type\":\"";
    output += (isDir)?"dir":"file";
    output += "\",\"name\":\"";
    output += String(entry.name()).substring(1);
    output += "\"}";
    entry.close();
  }
  output += "]";
  printer.println(output);
}

void failed_to_start() {
  if (!state.failedToStart) {
    state.failedToStart = true;
    printer.println("***** CRITICAL FAILURE *****")
           .println("* CANNOT START THE SYSTEM  *")
           .println("* TRY REBOOTING.           *")
           .println("****************************");
  }
}

void load_config() {
  printer.println("[load_config]");
  state.config_file_found = false;
  state.config_file_loaded = false;
  if (!SPIFFS.exists(CONFIG_FILE)) {
    printer.println("Config file not found!");
    save_config();
    mainFsm.transitionTo(EnableAP);
    return;
  }

  File configFile = SPIFFS.open("/config.json", "r");
  if (!configFile) {
    printer.println("Failed to open config file");
    remove_config_file();
    save_config();
    mainFsm.transitionTo(EnableAP);
    return;
  }

  state.config_file_found = true;
  size_t size = configFile.size();
  if (size > JSON_BUFFER_SIZE) {
    printer.println("Config file size is too large");
    remove_config_file();
    save_config();
    mainFsm.transitionTo(EnableAP);
    return;
  }

  // Allocate a buffer to store contents of the file.
  std::unique_ptr<char[]> buf(new char[size]);

  // We don't use String here because ArduinoJson library requires the input
  // buffer to be mutable. If you don't use ArduinoJson, you may as well
  // use configFile.readString instead.
  configFile.readBytes(buf.get(), size);

  StaticJsonBuffer<JSON_BUFFER_SIZE> jsonBuffer;
  JsonObject& json = jsonBuffer.parseObject(buf.get());

  if (!json.success()) {
    printer.println("Failed to parse config file");
    remove_config_file();
    save_config();
    mainFsm.transitionTo(EnableAP);
    return;
  }

  state.config_file_loaded = true;
  String storedConfigVersion = (const char*)json["configVersion"];
  if (state.configVersion != storedConfigVersion) {
    printer.println("Config version mismatch!")
           .print("Current: " + state.configVersion)
           .println(" Stored: " + storedConfigVersion)
           .println("Removing old configuration file")
           .println("and starting from scratch!");
    remove_config_file();
    save_config();
    mainFsm.transitionTo(EnableAP);
    return;
  }

  // state.ssid = (const char*)json["ssid"];
  // state.wifi_password = (const char*)json["password"];
  //state.wifi_configured = true;
  json.printTo(Serial);
  printer.println("");
  mainFsm.transitionTo(EnableAP);
}

void remove_config_file() {
  printer.println("Removing " + CONFIG_FILE + "...");
  SPIFFS.remove(CONFIG_FILE);
}

bool save_config() {
  StaticJsonBuffer<JSON_BUFFER_SIZE> jsonBuffer;
  JsonObject& json = jsonBuffer.createObject();
  json["configVersion"] = state.configVersion.c_str();;
  // json["ssid"] = state.ssid.c_str();
  // json["password"] = state.wifi_password.c_str();
  File configFile = SPIFFS.open(CONFIG_FILE, "w");
  if (!configFile) {
    printer.println("Failed to open config file for writing");
    return false;
  } else {
    json.printTo(configFile);
    printer.println("*** CONFIGURATION SAVED ***");
    return true;
  }
}

String getContentType(String filename) {
	if (server.hasArg("download")) return "application/octet-stream";
	else if (filename.endsWith(".htm")) return "text/html";
	else if (filename.endsWith(".html")) return "text/html";
	else if (filename.endsWith(".css")) return "text/css";
	else if (filename.endsWith(".js")) return "application/javascript";
	else if (filename.endsWith(".json")) return "application/json";
	else if (filename.endsWith(".png")) return "image/png";
	else if (filename.endsWith(".gif")) return "image/gif";
	else if (filename.endsWith(".jpg")) return "image/jpeg";
	else if (filename.endsWith(".ico")) return "image/x-icon";
	else if (filename.endsWith(".xml")) return "text/xml";
	else if (filename.endsWith(".pdf")) return "application/x-pdf";
	else if (filename.endsWith(".zip")) return "application/x-zip";
	else if (filename.endsWith(".gz")) return "application/x-gzip";
	return "text/plain";
}

bool handleFileRead(String path) {
  printer.println("[handleFileRead]: " + path);
  if (path.endsWith("/")) path += "index.html";
  String contentType = getContentType(path);
  String pathWithGz = path + ".gz";
  if (SPIFFS.exists(pathWithGz)) path = pathWithGz;
  if (SPIFFS.exists(path)) {
      File file = SPIFFS.open(path, "r");
      size_t sent = server.streamFile(file, contentType);
      size_t contentLength = file.size();
      file.close();
      return true;
  }
  return false;
}

void configure_web_routes() {
  // GET /
  server.on("/",HTTP_GET,[](){
    if(!handleFileRead("/index.html"))
      server.send(404, "text/plain", "404. NOT FOUND");
  });

  // GET /presets.html
  server.on("/presets.html", HTTP_GET, [](){
    if(!handleFileRead("/presets.html"))
      server.send(404, "text/plain", "404. NOT FOUND");
  });

  // PUT /presets.html
  // - All'update di un preset occorre ricalcolare
  //   la lista con i preset abilitati
  server.on("/presets.html", HTTP_PUT, [](){
  });

  server.onNotFound( []() {
    if (!handleFileRead(server.uri()))
      server.send(404, "text/plain", "FileNotFound");
  });
}

void enable_ap() {
  printer.println("[enable_ap]");
  WiFi.mode(WIFI_AP);
  WiFi.softAP(AP_NAME, AP_PASSWORD);
  configure_web_routes();
  server.begin();
  mainFsm.transitionTo(InitComplete);
}

void filterPresets() {
  state.enabledPresetCount = 0;
  Preset p;
  for(int i=0; i<state.presetCount; i++) {
    p = state.presets[i];
    if (p.enabled) {
      state.enabledPresets[state.enabledPresetCount] = p;
      state.enabledPresetCount++;
    }
  }
}

void performPreset() {
  Preset preset = state.enabledPresets[state.currentPreset];
  printer.println("[performPreset]")
         .println("Sending preset Nr. " + String(state.currentPreset))
         .println(preset.name + ": " + String(preset.configuration,16));
}

void handleNextClick(Button &btn) {
  printer.println("[nextPresetClick]: Current is " + String(state.currentPreset));
  state.currentPreset++;
  if (state.currentPreset >= state.enabledPresetCount) state.currentPreset = 0;
  performPreset();
}

void handleRewindClick(Button &btn) {
  printer.println("[rewindPresetClick]");
  state.currentPreset = 0;
  performPreset();
}

void handlePrevClick(Button &btn) {
  printer.println("[prevPresetClick]: Current is " + String(state.currentPreset));
  state.currentPreset--;
  if (state.currentPreset < 0) state.currentPreset = state.enabledPresetCount - 1;
  performPreset();
}

void configureButtons() {
  nextBtn.clickHandler(handleNextClick);
  rewindBtn.clickHandler(handleRewindClick);
  prevBtn.clickHandler(handlePrevClick);
}

void init_complete() {
  if (!state.initComplete) {
    state.initComplete = true;
    printer.println("[init_complete]")
           .println("Configuring buttons ...");
    configureButtons();
    printer.println("SYSTEM READY");
  }
}

void secondElapsed() {
  state.hbTick = !state.hbTick;
  if (state.hbTick) hbLed.on();
  else hbLed.off();
}

void handleButtons() {
  nextBtn.scan();
  rewindBtn.scan();
  prevBtn.scan();
}

void loop() {
  everySecondAction.check();
  server.handleClient();
  mainFsm.update();
  handleButtons();
}
