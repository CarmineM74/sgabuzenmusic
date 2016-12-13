#ifndef Preset_h
#define Preset_h

#include "Arduino.h"
#include <EEPROM.h>

struct PRE_READ{
	byte setting;
	byte title[16];
};

class Preset{
  public:
  Preset(int id,String name,int setting); // costruttore della classe
  int get_id();				   // ritorna l'id del preset
  String get_name();		   // ritorna il nome del preset
  PRE_READ read();			   // legge dalla EEPROM i dati del preset
  void write();				   // scrive il nome e il settaggio del preset sulla EEPROM
  private:
  String _name;  // nome del preset max 16 caratteri
  int _setting;  // numero tra 0 e 255 che serve per settare i vari relè
  int _id;
 };
  #endif
  

