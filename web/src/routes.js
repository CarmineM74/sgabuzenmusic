import Dashboard from './Dashboard.vue'
import EditPreset from './EditPreset.vue'

export const routes = [
  { path: '', component: Dashboard},
  { path: '/edit/:presetId', component: EditPreset},
  { path: '*', component: { template: '<h1>Nothing to see here!</h1>' } }
]
