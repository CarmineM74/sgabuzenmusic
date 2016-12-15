var PresetActions = require('../actions/PresetActions');

var PRESETS = [
  {name: "first", value: "58", enabled: true},
  {name: "second", value: "88", enabled: true},
  {name: "third", value: "33", enabled: false},
  {name: "fourth", value: "12", enabled: true},
];

var PresetSource = {
  fetch: function() {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve(PRESETS);
      }, 250);
    })
  }
}

module.exports = PresetSource;
