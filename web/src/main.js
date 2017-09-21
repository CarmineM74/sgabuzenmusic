import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import { routes } from './routes'
import { ADD_PRESET } from './mutation-types'

import App from './App.vue'

import presets from './assets/data/presets.js'

Vue.use(Vuex)
Vue.use(VueRouter)

const router = new VueRouter({
  routes: routes,
  mode: 'history'

})

const store = new Vuex.Store({
  state: {
    presets: []
  },
  actions: {
    [ADD_PRESET] (context, payload) {
      console.log('Doing some async stuff, maybe with backend')
      context.commit(ADD_PRESET, payload)
    }
  },
  getters: {
    presetCount: (state, getters) => {
      return state.presets.length
    }
  },
  mutations: {
    [ADD_PRESET] (state, preset) {
      state.presets.push(preset)
    }
  }
})

new Vue({
  el: '#app',
  render: h => h(App),
  router: router,
  store: store,
  created () {
    const vm = this
    setTimeout(() => {
      vm.$store.state.presets = presets
      console.log(vm.$store.state)
    }, 2000)
  }

})
