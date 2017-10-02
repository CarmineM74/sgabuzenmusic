<template>
  <Form :model="preset" >
    <FormItem label="Nome">
      <Input v-model="preset.name" placeholder="Nome" :disabled="update"></Input>
    </FormItem>
    <FormItem label="Valore">
      <Input v-model="preset.configuration" placeholder="Valore"></Input>
    </FormItem>
    <FormItem label="Abilitato">
      <i-switch v-model="preset.enabled" size="large">
        <span slot="true">Si</span>
        <span slot="false">No</span>
      </i-switch>
    </FormItem>
    <Button type="success" @click="save"><i class="fa fa-check"></i> Salva</Button>
    <Button type="error" @click="goBack"><i class="fa fa-ban"></i> Annulla</Button>
  </Form>
</template>

<script>

export default {
  name: 'EditPreset',
  data () {
    return {
      preset: undefined,
      update: false
    }
  },
  created () {
    console.log('[EditPreset] Router Params: ', this.$route.params)
    if (this.$route.params.presetId) {
      console.log('EDIT')
      this.preset = this.getPreset(this.$route.params.presetId)
      this.update = true
    } else {
      console.log('NEW')
      this.preset = {
        name: '',
        configuration: 0,
        enabled: false
      }
    }
  },
  methods: {
    goBack () {
      this.$router.back()
    },
    save () {
      this.$store.dispatch('savePreset', {preset: this.preset, isNew: !this.update})
      this.$Message.success('Modifiche salvate!')
      this.goBack()
    },
    getPreset (presetId) {
      return this.$store.state.presets.find(pres => pres.name == presetId)
    }
  }
}
</script>

