import Vue from 'vue'
import Vuex from 'vuex'
import presets from './assets/data/presets.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    presets: [],
    askDeleteConfimration: false
  },
  actions: {
    loadPresets ({state, commit}) {
      setTimeout(() => {
        commit('loadPresets', {presets: presets})
      }, 1000)
    },
    removePreset ({state, commit}, preset_id) {
      console.log('Deleting preset: ', preset_id)
      commit('deletePreset', {id: preset_id})
    }
  },
  getters: {
    presets: (state, getters) => {
      return state.presets
    },
    presetCount: (state, getters) => {
      return state.presets.length
    },
    askDeleteConfirmation: (state, getters) => {
      return state.askDeleteConfimration
    }
  },
  mutations: {
    loadPresets (state, payload) {
      state.presets = [...payload.presets]
    },
    deletePreset (state, payload) {
      state.askDeleteConfimration = true
    }
  }
})
