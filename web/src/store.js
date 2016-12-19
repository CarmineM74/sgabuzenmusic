import { createStore, combineReducers, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import mySaga from './sagas';

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
  console.log("Reducing presets: ", state);
  switch (action.type) {
    case 'LOAD_PRESETS_SUCCEEDED':
      return action.presets;
    
    default:
      return state;
  }
}

// Combined Reducers
const presetsApp = combineReducers({
  loadingPresets,
  presets
});

const sagaMiddleWare = createSagaMiddleware();

const store = createStore(presetsApp, applyMiddleware(sagaMiddleWare));

sagaMiddleWare.run(mySaga);

export default store;
