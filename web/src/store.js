import Vue from 'vue'
import Vuex from 'vuex'
import presets from './assets/data/presets.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    presets: [],
    loading: false
  },
  actions: {
    loadPresets ({state, commit}) {
      commit('loading', {status: true})
      setTimeout(() => {
        commit('loadPresets', {presets: presets})
        commit('loading', {status: false})
      }, 1000)
    },
    deletePreset ({state, commit}, presetId) {
      console.log('Deleting preset: ', presetId)
      commit('deletePreset', {id: presetId})
    }
  },
  getters: {
    presetCount: (state, getters) => {
      return state.presets.length
    }
  },
  mutations: {
    loading (state, payload) {
      state.loading = payload.status
    },
    loadPresets (state, payload) {
      state.presets = [...payload.presets]
    },
    deletePreset (state, payload) {
      console.log('Committing deletePreset mutation: ', payload)
      const newPresets = state.presets.filter((preset) => { return preset.id !== payload.id })
      this.state.presets = newPresets
    }
  }
})
