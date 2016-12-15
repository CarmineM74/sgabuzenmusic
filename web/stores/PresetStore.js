var alt = require('../alt');
var PresetActions = require('../actions/PresetActions');

class PresetStore {

  constructor() {
    this.presets = [];
    this.bindListeners({
      handleUpdatePresets: PresetActions.UPDATE_PRESETS
    })
  }

  handleUpdatePresets(presets) {
    this.presets = presets;
  }

}

module.exports = alt.createStore(PresetStore, 'PresetStore');
