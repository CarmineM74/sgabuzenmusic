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

function* mySaga() {
  console.log("RUNNING MY SAGA ...");
  yield takeEvery("LOAD_PRESETS", loadPresets);
}

export default mySaga;
