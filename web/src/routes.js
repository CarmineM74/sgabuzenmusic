import Dashboard from './Dashboard.vue'

export const routes = [
  { path: '', component: Dashboard},
  { path: '*', component: { template: '<h1>Nothing to see here!</h1>' } }
]
