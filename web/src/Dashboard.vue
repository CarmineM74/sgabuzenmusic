<template>
  <div class="card">
    <div class="card-body">
      <h4 class="card-title">Dashboard</h4>
      <p v-if="presetCount == 0" class="card-text">Nothing yet</p>
      <p v-else class="card-text">There are {{ presetCount }} presets</p>
      <ul v-if="presetCount > 0">
        <li v-for="preset in presets" key="preset.id">{{preset.name}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  computed: {
    presets () {
      return this.$store.state.presets
    },
    presetCount () {
      return this.$store.getters.presetCount
    }
  }
}
</script>
