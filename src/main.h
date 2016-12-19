#include <Arduino.h>
#ifndef MAIN_H
#define MAIN_H
#include <Button.h>

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

#endif
