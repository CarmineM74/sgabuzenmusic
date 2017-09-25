<template>
  <div>
    <h4>Nothing here </h4>
    <p>
      {{preset}}
    </p>
  </div>
</template>

<script>
export default {
  name: 'EditPreset',
  created () {
    console.log('Editing preset: ', this.$route.params)
  },
  data () {
    return {
    }
  },
  computed: {
    preset () {
      console.log('Fetching preset: ', this.$route.params)
      return this.$store.state.presets[this.$route.params.presetId]
    }
  }
}
</script>

