<template>
  <div class="card">
    <div class="card-body">
      <h4 class="card-title">Dashboard</h4>
      <button class="btn btn-primary" @click="addPreset">Add Preset</button>
      <p v-if="presetCount == 0" class="card-text">Nothing yet</p>
      <p v-else class="card-text">There are {{ presetCount }} presets</p>
      <ul v-if="presetCount > 0">
        <li v-for="preset in presets" key="preset.id">{{preset.name}}</li>
      </ul>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  methods: {
    addPreset (evt) {
      this.$store.commit('addPreset', {id: 999, name: 'Added', value: 1974, enabled: false})
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
