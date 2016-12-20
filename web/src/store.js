import { createStore, combineReducers, applyMiddleware} from 'redux';
import { combineForms } from 'react-redux-form';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';

// Utility functions

function updateObject(oldObject, newValues) {
    // Encapsulate the idea of passing a new object as the first parameter
    // to Object.assign to ensure we correctly copy data instead of mutating
    return Object.assign({}, oldObject, newValues);
}

function updateItemInArray(array, itemId, updateItemCallback) {
    const updatedItems = array.map(item => {
        if(item.id !== itemId) {
            // Since we only want to update one item, preserve all others as they are now
            return item;
        }

        // Use the provided callback to create an updated item
        const updatedItem = updateItemCallback(item);
        return updatedItem;
    });

    return updatedItems;
}

// Individual Reducers
const loadingPresets = (state = false, action) => {
  switch (action.type) {
    case 'LOAD_PRESETS':
      console.log("[STORE LOAD PRESETS]");
      return true;  
    default:
      console.log("[STORE LOAD PRESETS DEFAULT]");
      return false;
  }
}

const presets = (state = [], action) => {
  switch (action.type) {
    case 'LOAD_PRESETS_SUCCEEDED':
      console.log("[LOAD_PRESETS_SUCCEEDED]", action);
      return action.presets;
    case 'DELETE_PRESET':
      console.log("[presets] Deleting preset ", state, action.presetName, action.idx);
      return [
        ...state.slice(0,action.idx),
        ...state.slice(action.idx+1)
      ];
    default:
      return state;
  }
}

const EMPTY_PRESET = {
  name: "",
  value: 0,
  enabled: false
};


const selectedPresetIdx = (state = -1, action) => {
  return state;
};


// Combined Reducers
const presetsApp = combineForms({
  loadingPresets,
  presets,
  selectedPresetIdx
});

const sagaMiddleWare = createSagaMiddleware();

const store = createStore(presetsApp, applyMiddleware(sagaMiddleWare));

sagaMiddleWare.run(rootSaga);

export default store;
