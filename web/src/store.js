import { createStore } from 'redux';

const state = (currentState, action) => {
  return currentState;
}

const store = createStore(state);

module.export = store;
