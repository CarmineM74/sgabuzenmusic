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
// D3 - I2C
// D4 - Onboard LED (WLED)
LED hbLed = LED(D4);

// D5 - NEXT PRESET BUTTON
// D6 - REWIND TO 0 BUTTON
// D7 - PREVIOUS PRESET BUTTON
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
};

AppState state;

TimedAction everySecondAction       = TimedAction(1 * SECOND, secondElapsed);

void setup() {
  state.failedToStart = false;
  state.fwVersion = "0.0.0";
  state.configVersion = "0.0.0";
  state.initComplete = false;
  state.config_file_found = false;
  state.config_file_loaded = false;
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
    mainFsm.transitionTo(LoadConfig);
  }
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

void configure_web_routes() {
  // GET /
  server.on("/",[](){
    if (server.method() == HTTP_GET) {
      printer.println("[HTTP] GET / REQUEST RECEIVED!");
      //getContentType
    } else {
      if (server.args() != 0) {
        String message = "";
        for ( uint8_t i = 0; i < server.args(); i++ ) {
        		message = " " + server.argName ( i ) + ": " + server.arg ( i );
            printer.println(message);
        }
      }
      // state.ssid = server.arg("ssid");
      // state.wifi_password = server.arg("password");
      server.send(200,"text/html","<b>Saving credentials!</b>");
      save_config();
    }
  });

  // PUT /presets/name?value=data
  server.on("/presets", [](){
    if (server.method() == HTTP_PATCH) {

    } else {
      printer.println("[HTTP] INVALID VERB ON /presets/:name?value=data");
      server.send(401,"text/html", "<p><b> :( </b></p>");
    }
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

void init_complete() {
  if (!state.initComplete) {
    state.initComplete = true;
    printer.println("[init_complete]")
           .println("SYSTEM READY");
  }
}

void secondElapsed() {
  state.hbTick = !state.hbTick;
  if (state.hbTick) hbLed.on();
  else hbLed.off();
}

void loop() {
  everySecondAction.check();
  server.handleClient();
  mainFsm.update();
}
