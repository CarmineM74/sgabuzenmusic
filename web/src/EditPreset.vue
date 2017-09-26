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
    <Button type="success" @click="save"><i class="fa fa-check"></i> Salva</Button>
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
    if (this.$router.params) {
      console.log('EDIT')
      this.preset = this.getPreset(this.$route.params.presetId)
    } else {
      console.log('NEW')
      this.preset = {
        id: 0,
        name: '',
        value: 0,
        enabled: false
      }
    }
  },
  methods: {
    goBack () {
      this.$router.back()
    },
    save () {
      this.$store.dispatch('savePreset', this.preset)
      this.$Message.success('Modifiche salvate!')
      this.goBack()
    },
    getPreset (presetId) {
      return this.$store.state.presets.find(pres => pres.id == presetId)
    }
  }
}
</script>

