import { delay, takeEvery, takeLatest } from 'redux-saga'
import { call, put } from 'redux-saga/effects'

const DUMMY_PRESETS = [
    {name: "first", value: "58", enabled: true},
    {name: "second", value: "88", enabled: true},
    {name: "third", value: "33", enabled: false},
    {name: "fourth", value: "12", enabled: true},
];

function* loadPresets() {
  console.log("[SAGA LOADING PRESETS]");
  yield delay(2000);
  yield put({type: "LOAD_PRESETS_SUCCEEDED", presets: DUMMY_PRESETS});
}

function* savePreset(action) {
  console.log("[SAGA SAVING PRESET]", action);
  yield delay(300);
  yield put({type: "SAVE_PRESET_SUCCEEDED", preset: action.preset});
}

function* updatePreset(action) {
  console.log("[SAGA UPDATING PRESET]", action);
  yield delay(300);
  yield put({type: "UPDATE_PRESET_SUCCEEDED", preset: action.preset});
}

function* deletePreset(action){
  console.log("[SAGA DELETING PRESET]", action);
  yield put({type: "PRESET_DELETED", presetName: action.presetName});
}

function* findPresetByName(action) {
  console.log("[SAGA FINDING PRESET]", action);
  yield put({type: "PRESET_FOUND", preset: {found: true, name: "found", value: 255, enabled: true}});
}

export default function* rootSaga() {
  yield takeLatest("LOAD_PRESETS", loadPresets);
  yield takeEvery("DELETE_PRESET", deletePreset);
  yield takeLatest("SAVE_PRESET", savePreset);
  yield takeLatest("UPDATE_PRESET", updatePreset);
  yield takeLatest("FIND_PRESET_BY_NAME", findPresetByName);
};
