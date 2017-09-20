import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import { routes } from './routes'

import App from './App.vue'

Vue.use(Vuex)
Vue.use(VueRouter)

const router = new VueRouter({
  routes: routes,
  mode: 'history'

})

const store = new Vuex.Store({
  state: {
    presets: [],
    presetCount: 0
  }
})

import presets from './assets/data/presets.js'

new Vue({
  el: '#app',
  render: h => h(App),
  router: router,
  store: store,
  created () {
    const vm = this
    setTimeout(() => {
      console.log('Changing store.state with: ', presets)
      vm.$store.state.presets = presets
      vm.$store.state.presetCount = presets.length
      console.log(vm.$store.state)
    }, 2000)
  }

})
