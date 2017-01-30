import { createStore, combineReducers, applyMiddleware} from 'redux';
import { createForms } from 'react-redux-form';
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

const isLoadingPresets = (state = false, action) => {
  switch (action.type) {
    case 'LOAD_PRESETS': return true;
    default:
      return false;
  }
}

const EMPTY_PRESET_FORM = {
  name: "Empty",
  value: 0,
  enabled: false
}

const preset = (state = EMPTY_PRESET_FORM, action) => {
  console.log("[preset]", state, action);
  switch (action.type) {
    case 'SELECT_PRESET':
      return action.preset;
    default:
      return state;
  }
}

const presets = (state = [], action) => {
  switch (action.type) {
    case 'LOAD_PRESETS_SUCCEEDED': 
      return action.presets;
    case 'SAVE_PRESET_SUCCEEDED':
      console.log("APPENDING NEWLY CREATED PRESET");
      return [
        ...state,
        action.preset
      ]
    case 'UPDATE_PRESET_SUCCEEDED':
      console.log("UPDATE PRESET", action);
      const idx = state.findIndex((preset) => preset.name === action.preset.name);
      console.log("Found element at ", idx);
      console.log("ACTUAL STATE IS ", state);

      // Is really newState a completely new object?
      // ... operator produces a shallow copy
      const newState = [
        ...state.slice(0,idx),
        action.preset,
        ...state.slice(idx+1)
      ];

      console.log("NEW STATE IS ", newState);

      return newState;
    case 'DELETE_PRESET': 
      const newPresets = [
        ...state.slice(0,action.idx),
        ...state.slice(action.idx+1)
      ];
      return newPresets;
    default: return state;
  }
}

// Combined Reducers
const presetsApp = combineReducers({
  isLoadingPresets,
  presets,
  ...createForms({preset})
});

const sagaMiddleWare = createSagaMiddleware();

const store = createStore(presetsApp, applyMiddleware(sagaMiddleWare));

sagaMiddleWare.run(rootSaga);

export default store;
