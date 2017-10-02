import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import presets from './assets/data/presets.js'

Vue.use(Vuex)

const axios = Axios.create({
  baseURL: 'http://192.168.4.1'
})

export default new Vuex.Store({
  state: {
    presets: [],
    loading: false
  },
  actions: {
    loadPresets ({state, commit}) {
      commit('loading', {status: true})
      axios.get('/presets.json')
        .then(response => {
          console.log('DONE FETCHING PRESETS: ', response)
          commit('loadPresets', {presets: response.data})
          commit('loading', {status: false})
        })
        .catch(error => {
          console.log('ERROR FETCHING PRESETS: ', error)
        })
    },
    deletePreset ({state, commit}, presetId) {
      console.log('Deleting preset: ', presetId)
      axios.delete('/delete', { params: {id: presetId} })
        .then(response => {
          console.log('DONE DELETING: ', response)
          commit('deletePreset', {name: presetId})
        })
        .catch(error => {
          console.log('ERROR DELETING PRESET: ', error)
        })
    },
    savePreset ({state, commit}, payload) {
      console.log('Persisting changes: ', payload)
      commit('savePreset', payload)
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
      const newPresets = state.presets.filter((preset) => { return preset.name !== payload.name })
      this.state.presets = newPresets
    },
    savePreset (state, {preset, isNew}) {
      console.log('Saving changes ...')
      console.log('isNew', isNew)
      console.log('Preset', preset)
      if (isNew == true) {
        console.log('CREATE')
        axios.post('/create', {
          params: {
            name: preset.name,
            configuration: preset.configuration,
            enabled: preset.enabled
          }
        })
          .then(response => {
            state.presets = [
              ...state.presets,
              preset
            ]
          })
          .catch(error => {
            console.log('ERROR CREATING PRESET: ', error)
          })
      } else {
        console.log('UPDATE')
        axios.put('/update', {
          params: {
            name: preset.name,
            configuration: preset.configuration,
            enabled: preset.enabled
          }
        })
          .then(response => {
            console.log('UPDATED')
          })
          .catch(error => {
            console.log('ERROR CREATING PRESET: ', error)
          })
      }
    }
  }
})
