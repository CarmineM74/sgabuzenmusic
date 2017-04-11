#include <Arduino.h>
#ifndef MAIN_H
#define MAIN_H
#include <Button.h>
#include <ArduinoJson.h>

struct Preset {
  //char name[PRESET_NAME_MAX_LEN];
  String name;
  byte configuration;
  bool enabled;
  bool deleted;
};

void setupFakePresets();
void boot();
void fsDirToSerial();
void load_config();
bool save_config();
void remove_config_file();
String getContentType(String filename);
bool handleFileRead(String path);
void configure_web_routes();
void enable_ap();
void init_complete();
void failed_to_start();
void secondElapsed();
void handleButtons();
void handleNextClick(Button &btn);
void handleRewindClick(Button &btn);
void handlePrevClick(Button &btn);
void performPreset();
String deletePreset(String name);
JsonObject& serializePreset(JsonBuffer& jsonBuffer, Preset ps);
void serializePresetsToJson(JsonBuffer& jsonuffer, JsonArray& data);

#endif
