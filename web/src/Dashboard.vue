<template>
  <div class="card">
    <div class="card-body">
      <h4 class="card-title">Dashboard</h4>
      <button class="btn btn-primary" @click="addPreset({id: 999, name: 'Added', value: 1974, enabled: false})">Add Preset</button>
      <p v-if="presetCount == 0" class="card-text">Nothing yet</p>
      <p v-else class="card-text">There are {{ presetCount }} presets</p>
      <ul v-if="presetCount > 0">
        <li v-for="preset in presets" :key="preset.id">{{preset.name}}</li>
      </ul>
    </div>
  </div>
</template>

<script>

import { mapGetters, mapMutations } from 'vuex'
import { ADD_PRESET } from './mutation-types'

export default {
  name: 'Dashboard',
  methods: {
    [ADD_PRESET] (preset) {
      this.$store.dispatch(ADD_PRESET, preset)
    }
  },
  computed: {
    presets () {
      return this.$store.state.presets
    },
    ...mapGetters(['presetCount'])
  }
}
</script>
