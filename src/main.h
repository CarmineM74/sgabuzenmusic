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
void filterPresets();
void handleNextClick(Button &btn);
void handleRewindClick(Button &btn);
void handlePrevClick(Button &btn);
void performPreset();
void shutdownExtenderOutput();
String addPreset(String params);
String deletePreset(String name);
String updatePreset(String params);
JsonObject& serializePreset(JsonBuffer& jsonBuffer, Preset ps);
void serializePresetsToJson(JsonBuffer& jsonuffer, JsonArray& data);

#endif
