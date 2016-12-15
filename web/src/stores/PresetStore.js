var alt = require('../alt');
var PresetActions = require('../actions/PresetActions');
var PresetSource = require('../sources/PresetSource');

class PresetStore {

  constructor() {
    this.presets = [];
    this.errorMessage = null;

    this.bindListeners({
      handleUpdatePresets: PresetActions.UPDATE_PRESETS,
      handleFetchPresets: PresetActions.FETCH_PRESETS,
      handlePresetsFailed: PresetActions.PRESETS_FAILED
    })
  }

  handleUpdatePresets(presets) {
    this.presets = presets;
    this.errorMessage = null;
  }

  handleFetchPresets() {
    this.presets = [];

  }

  handlePresetsFailed(errorMessage) {
    this.errorMessage = errorMessage;
  }

}

module.exports = alt.createStore(PresetStore, 'PresetStore');
