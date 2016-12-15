var alt = require('../alt');

class PresetActions {
  updatePresets(prests) {
    return presets;
  }

  fetchPresets() {
    return (dispatch) => {
      // dispatch an event
      dispatch();
      PresetSource.fetch()
        .then((presets) => {
          this.updatePresets(presets);
        })
        .catch((errorMessage) => {
          this.presetsFailed(errorMessage);
        })
    }
  }

  presetsFailed(errorMessage) {
    return errorMessage;
  }
}

module.exports = alt.createActions(PresetActions);
