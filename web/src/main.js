import Vue from 'vue'
import iView from 'iview'
import 'iview/dist/styles/iview.css'

import VueRouter from 'vue-router'
import { routes } from './routes'
import Store from './store'

import App from './App.vue'

Vue.use(iView)
Vue.use(VueRouter)

const router = new VueRouter({
  routes: routes,
  mode: 'history'
})

new Vue({
  el: '#app',
  render: h => h(App),
  router: router,
  store: Store
})
