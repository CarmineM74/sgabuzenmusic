import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueRouter from 'vue-router'
import { routes } from './routes'
import Store from './store'

import App from './App.vue'

Vue.use(BootstrapVue)
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
