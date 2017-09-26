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
    },
    savePreset ({state, commit}, preset) {
      console.log('Persisting changes: ', preset)
      commit('savePreset', {preset: preset})
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
    },
    savePreset (state, payload) {
      console.log('Saving changes ...')
      if (payload.preset.id == 0) {
        console.log('CREATE')
        payload.preset.id = state.presets[state.presets.length - 1].id + 1
        state.presets = [
          ...state.presets,
          payload.preset
        ]
      } else {
        console.log('UPDATE')
      }
    }
  }
})
