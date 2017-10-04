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
#include <pcf8574_esp.h>

#define ON                                              true
#define OFF                                             false
#define SECOND                                          1000
#define MINUTE                                          60 * SECOND
#define MAX_PRESETS                                     32
#define PRESET_NAME_MAX_LEN                             32
#define JSON_BUFFER_SIZE                                1024
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

TwoWire twoWire;
PCF857x pcf8574(0x38, &twoWire);


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

// TODO:
// DELETE THIS FUNCTION
void setupFakePresets() {
  state.presets[0].name = "Carmine";
  state.presets[0].configuration = 74;
  state.presets[0].enabled = true;
  state.presets[0].deleted = false;
  state.presets[1].name = "Francesco";
  state.presets[1].configuration = 77;
  state.presets[1].enabled = true;
  state.presets[1].deleted = false;
  state.presets[2].name = "Anna";
  state.presets[2].configuration = 80;
  state.presets[2].enabled = true;
  state.presets[2].deleted = false;
  state.presets[3].name = "Enrico";
  state.presets[3].configuration = 9;
  state.presets[3].enabled = true;
  state.presets[3].deleted = false;
  state.presets[4].name = "Assunta";
  state.presets[4].configuration = 17;
  state.presets[4].enabled = true;
  state.presets[4].deleted = false;
  state.presetCount = 5;
}

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

  // FAKE PRESETS
  //setupFakePresets();
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
  // if (size > JSON_BUFFER_SIZE) {
  //   printer.println("Config file size is too large");
  //   remove_config_file();
  //   save_config();
  //   mainFsm.transitionTo(EnableAP);
  //   return;
  // }

  // Allocate a buffer to store contents of the file.
  std::unique_ptr<char[]> buf(new char[size]);

  // We don't use String here because ArduinoJson library requires the input
  // buffer to be mutable. If you don't use ArduinoJson, you may as well
  // use configFile.readString instead.
  configFile.readBytes(buf.get(), size);

  DynamicJsonBuffer jsonBuffer(JSON_BUFFER_SIZE);
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

  json.printTo(Serial);
  state.presetCount = (json["presets"].asArray()).size();
  for(int i = 0; i < state.presetCount; i++) {
    state.presets[i].name = json["presets"][i]["name"].asString();
    state.presets[i].configuration = String(json["presets"][i]["configuration"].asString()).toInt();
    state.presets[i].enabled = json["presets"][i]["enabled"];
  }
  printer.println("");
  mainFsm.transitionTo(EnableAP);
}

void remove_config_file() {
  printer.println("Removing " + CONFIG_FILE + "...");
  SPIFFS.remove(CONFIG_FILE);
}

bool save_config() {
  DynamicJsonBuffer jsonBuffer(JSON_BUFFER_SIZE);
  JsonObject& json = jsonBuffer.createObject();
  json["configVersion"] = state.configVersion.c_str();
  JsonArray &data = jsonBuffer.createArray();
  serializePresetsToJson(jsonBuffer, data);
  json["presets"] = data;
  File configFile = SPIFFS.open(CONFIG_FILE, "w");
  if (!configFile) {
    printer.println("Failed to open config file for writing");
    return false;
  } else {
    printer.println("*** SAVING CONFIGURATION ***");
    json.printTo(Serial);
    json.printTo(configFile);
    printer.println("\n*** CONFIGURATION SAVED ***");
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

JsonObject& serializePreset(JsonBuffer& jsonBuffer, Preset ps) {
  JsonObject& o = jsonBuffer.createObject();
  o.set("name", ps.name);
  o.set("enabled", ps.enabled);
  o.set("configuration", ps.configuration);
  return o;
}

void serializePresetsToJson(JsonBuffer& jsonBuffer, JsonArray& data) {
  for(int i=0; i<state.presetCount; i++) {
    if (!state.presets[i].deleted) {
      printer.print("Serializing preset: " + String(i));
      printer.println(" - " + state.presets[i].name);
      data.add(serializePreset(jsonBuffer, state.presets[i]));
    }
  }
}

int indexOfPreset(String name) {
  int idx = 0;
  bool found = false;
  for(idx = 0; idx < state.presetCount; idx++) {
    if (state.presets[idx].name == name) {
      found = true;
      break;
    }
  }
  if (found)
    return idx;
  else
    return -1;
}

String deletePreset(String name) {
  int idx = indexOfPreset(name);
  if (idx >= 0) {
    printer.println("Marking " + name + " DELETED!");
    state.presets[idx].deleted = true;
    return "OK";
  } else {
    return "NOT FOUND";
  }
}

bool hasPreset(String name) {
  bool result = false;
  result = (indexOfPreset(name) >= 0);
  return result;
}

String addPreset(String params) {
  DynamicJsonBuffer jsonBuffer(JSON_BUFFER_SIZE);
  JsonObject& json = jsonBuffer.parseObject(params);
  json.printTo(Serial);
  printer.println("");
  if ((state.presetCount+1) > MAX_PRESETS)
    return "MAX PRESET COUNT REACHED!";
  if (!hasPreset(json["params"]["name"])) {
    printer.println("ADDING PRESET:");
    state.presets[state.presetCount].name = json["params"]["name"].asString();
    state.presets[state.presetCount].configuration = String(json["params"]["configuration"].asString()).toInt();
    state.presets[state.presetCount].enabled = json["params"]["enabled"];
    state.presets[state.presetCount].deleted = false;
    state.presetCount++;
    printer.println("PRESET ADDED");
    return "OK";
  } else {
    printer.println("PRESET ALREADY EXISTS");
    return "ALREADY EXIST";
  }
}

String updatePreset(String params) {
  DynamicJsonBuffer jsonBuffer(JSON_BUFFER_SIZE);
  JsonObject& json = jsonBuffer.parseObject(params);
  json.printTo(Serial);
  printer.println("");
  int idx = indexOfPreset(json["params"]["name"].asString());
  if (idx >= 0) {
    printer.println("UPDATING PRESET:");
    state.presets[idx].name = json["params"]["name"].asString();
    state.presets[idx].configuration = String(json["params"]["configuration"].asString()).toInt();
    state.presets[idx].enabled = json["params"]["enabled"];
    printer.println("PRESET UPDATED");
    return "OK";
  } else {
    printer.println("PRESET NOT FOUND");
    return "NOT FOUND";
  }
}

void configure_web_routes() {
  // GET /
  server.on("/",HTTP_GET,[](){
    server.sendHeader("Access-Control-Allow-Methods", "POST,GET,PUT,DELETE,OPTIONS");
    server.sendHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if(!handleFileRead("/index.html"))
      server.send(404, "text/plain", "404. NOT FOUND");
  });

  // GET /presets.html
  server.on("/presets.json", HTTP_GET, [](){
    DynamicJsonBuffer jsonBuffer(JSON_BUFFER_SIZE);
    JsonArray &data = jsonBuffer.createArray();
    serializePresetsToJson(jsonBuffer, data);
    int buffer_size = data.measureLength()+1;
    printer.println("Dimensione del buffer: " + String(buffer_size) + "...");
    char *buffer = (char*)malloc(buffer_size*sizeof(char));
    data.printTo(buffer, buffer_size);
    data.printTo(Serial);
    server.sendHeader("Access-Control-Allow-Methods", "POST,GET,PUT,DELETE,OPTIONS");
    server.sendHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    server.send(200, "application/json", buffer);
    free(buffer);
    buffer = 0;
  });

  server.on("/delete", HTTP_OPTIONS, [](){
    printer.println("HTTP_OPTIONS");
    server.sendHeader("Access-Control-Max-Age", "10000");
    server.sendHeader("Access-Control-Allow-Methods", "POST,GET,PUT,DELETE,OPTIONS");
    server.sendHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    server.send(200, "text/plain", "" );
  });

  server.on("/delete", HTTP_DELETE, [](){
    printer.println("/delete SERVER ARGS: " + server.arg(0));
    server.sendHeader("Access-Control-Allow-Methods", "POST,GET,PUT,DELETE,OPTIONS");
    server.sendHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    String deleted_status = deletePreset(server.arg(0));
    int status = 200;
    if (deleted_status != "OK")
      status = 404;
    else {
      save_config();
      filterPresets();
    }
    server.send(status, "application/text", deleted_status);
  });

  server.on("/create", HTTP_OPTIONS, [](){
    printer.println("HTTP_OPTIONS");
    server.sendHeader("Access-Control-Max-Age", "10000");
    server.sendHeader("Access-Control-Allow-Methods", "POST,GET,PUT,DELETE,OPTIONS");
    server.sendHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    server.send(200, "text/plain", "" );
  });

  server.on("/create", HTTP_POST, [](){
    printer.println("/create SERVER ARGS: " + server.arg("plain"));
    server.sendHeader("Access-Control-Allow-Methods", "POST,GET,PUT,DELETE,OPTIONS");
    server.sendHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    String create_status = addPreset(server.arg("plain"));
    int status = 200;
    if (create_status != "OK")
      status = 404;
    else {
      save_config();
      filterPresets();
    }
    server.send(status, "application/text", create_status);
  });

  server.on("/update", HTTP_OPTIONS, [](){
    printer.println("HTTP_OPTIONS");
    server.sendHeader("Access-Control-Max-Age", "10000");
    server.sendHeader("Access-Control-Allow-Methods", "POST,GET,PUT,DELETE,OPTIONS");
    server.sendHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    server.send(200, "text/plain", "" );
  });

  server.on("/update", HTTP_PUT, [](){
    printer.println("/update SERVER ARGS: " + server.arg("plain"));
    server.sendHeader("Access-Control-Allow-Methods", "POST,GET,PUT,DELETE,OPTIONS");
    server.sendHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    String update_status = updatePreset(server.arg("plain"));
    int status = 200;
    if (update_status != "OK")
      status = 404;
    else {
      save_config();
      filterPresets();
    }
    server.send(status, "application/text", update_status);
  });

  server.onNotFound( []() {
    if (!handleFileRead(server.uri()))
      server.send(404, "text/plain", "404. NOT FOUND");
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
    if (!p.deleted && p.enabled) {
      state.enabledPresets[state.enabledPresetCount] = p;
      state.enabledPresetCount++;
    }
  }
}

void performPreset() {
  Preset preset = state.enabledPresets[state.currentPreset];
  printer.println("[performPreset]")
         .println("Sending preset Nr. " + String(state.currentPreset))
         .println(String(preset.name) + ": " + String(preset.configuration,16));
  pcf8574.write8(preset.configuration);
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
    printer.println("Configuring extender ...");
    twoWire.setClock(100000L);
    pcf8574.begin();
    printer.println("Shutting down extender's outputs ...");
    shutdownExtenderOutput();
    printer.println("PresetCount: " + String(state.presetCount));
    printer.println("SYSTEM READY");
  }
}

void shutdownExtenderOutput() {
  pcf8574.write(0,LOW);
  pcf8574.write(1,LOW);
  pcf8574.write(2,LOW);
  pcf8574.write(3,LOW);
  pcf8574.write(4,LOW);
  pcf8574.write(5,LOW);
  pcf8574.write(6,LOW);
  pcf8574.write(7,LOW);
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
