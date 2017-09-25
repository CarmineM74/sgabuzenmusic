<template>
  <Form :model="preset" >
    <FormItem label="Nome">
      <Input v-model="preset.name" placeholder="Nome"></Input>
    </FormItem>
    <FormItem label="Valore">
      <Input v-model="preset.value" placeholder="Valore"></Input>
    </FormItem>
    <FormItem label="Abilitato">
      <i-switch v-model="preset.enabled" size="large">
        <span slot="true">Si</span>
        <span slot="false">No</span>
      </i-switch>
    </FormItem>
    <Button type="success" @click="goBack"><i class="fa fa-check"></i> Salva</Button>
    <Button type="error" @click="goBack"><i class="fa fa-ban"></i> Annulla</Button>
  </Form>
</template>

<script>
export default {
  name: 'EditPreset',
  data () {
    return {
      preset: undefined
    }
  },
  created () {
    this.preset = this.getPreset(this.$route.params.presetId)
  },
  methods: {
    goBack () {
      this.$router.back()
    },
    getPreset (presetId) {
      return this.$store.state.presets.find(pres => pres.id == presetId)
    }
  }
}
</script>

