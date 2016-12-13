#include <Arduino.h>
#ifndef MAIN_H
#define MAIN_H

void boot();
void load_config();
bool save_config();
void remove_config_file();
void enable_ap();
void init_complete();
void failed_to_start();
void secondElapsed();

#endif
