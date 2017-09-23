import Vue from 'vue'
import Vuex from 'vuex'
import presets from './assets/data/presets.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    presets: []
  },
  actions: {
    loadPresets ({state, commit}) {
      setTimeout(() => {
        commit('loadPresets', {presets: presets})
      }, 2000)
    }
  },
  getters: {
    presets: (state, getters) => {
      return state.presets
    },
    presetCount: (state, getters) => {
      return state.presets.length
    }
  },
  mutations: {
    loadPresets (state, payload) {
      state.presets = [...payload.presets]
    }
  }
})
