#include "Arduino.h"
#include "Preset.h"


 Preset::Preset(int id,String name,int setting)
  {
    _id=id;
	_name=name;
	_setting=setting;
  }
  
  int Preset::get_id()
  {
    return _id;
  }
  String Preset::get_name()
  {
	return _name;
  }
  PRE_READ Preset::read()
  {
	int i=0;
	PRE_READ lettura;
	lettura.setting=EEPROM.read(_id*17);
		for(i=1;i<17;i++)
			lettura.title[i]= EEPROM.read(i+_id*17);
	return lettura;
  }
  void Preset::write()
  {
	int i=0;
	PRE_READ lettura;
	EEPROM.write(_id*17, _setting);
		for(i=1;i<17;i++)
			lettura.title[i]= EEPROM.read(i+_id*17);
  }
  
  
  


