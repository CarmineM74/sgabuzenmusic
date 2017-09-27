<template>
  <Icon :type="glyph" :color="color" />
</template>

<script>
export default {
  props: ['status'],
  computed: {
    glyph () {
      if (this.status) {
        return 'checkmark'
      } else {
        return 'close-round'
      }
    },
    color () {
      return this.status ? 'green' : 'red'
    }
  }
}
</script>

