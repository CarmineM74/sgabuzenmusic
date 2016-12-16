import { createStore, combineReducers } from 'redux';

const DUMMY_PRESETS = [
    {name: "first", value: "58", enabled: true},
    {name: "second", value: "88", enabled: true},
    {name: "third", value: "33", enabled: false},
    {name: "fourth", value: "12", enabled: true},
];

// Individual Reducers
const presets = (state = DUMMY_PRESETS, action) => {
  console.log("Reducing presets: ", state);
  return state;
}

// Combined Reducers
const presetsApp = combineReducers({
  presets
});

const store = createStore(presetsApp);

export default store;
