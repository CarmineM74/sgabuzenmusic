// Load presets from backend
export function loadPresets() {
  return {
    type: 'LOAD_PRESETS'
  }
}

export function deletePreset(presetName, idx) {
  return {
    type: "DELETE_PRESET",
    presetName,
    idx
  }
}

export function selectPreset(preset) {
  return {
    type: "SELECT_PRESET",
    preset
  }
}

export function findPresetByName(presetName) {
  return {
    type: "FIND_PRESET_BY_NAME",
    presetName
  }
}
