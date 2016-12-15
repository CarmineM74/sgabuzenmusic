import { createStore, combineReducers } from 'redux';

const INITIAL_STATE = {
  presets: [
    {name: "first", value: "58", enabled: true},
    {name: "second", value: "88", enabled: true},
    {name: "third", value: "33", enabled: false},
    {name: "fourth", value: "12", enabled: true},
  ]
};

// Individual Reducers
const presets = (state = INITIAL_STATE, action) => {
  return state
}

// Combined Reducers
const presetApp = combineReducers({
  presets
})

const store = createStore(presetsApp);

module.export = store;
