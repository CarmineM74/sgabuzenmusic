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

new Vue({
  el: '#app',
  render: h => h(App),
  router: router
})
