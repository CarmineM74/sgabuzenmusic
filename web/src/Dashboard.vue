<template>
    <Row type="flex" justify="center" align="middle" v-if="presetCount==0">
      <img src="./assets/Gear.gif" alt="gear" class="gear">
    </Row>
    <div v-else>
      <Row type="flex">
        <Col span="24">
          <Button type="primary"><i class="fa fa-plus"></i> Aggiungi preset</Button>
        </Col>
      </Row>
      <Row type="flex">
        <Col span="24">
          <Table strip border :columns="columns" :data="presets"></Table>
        </Col>
      </Row>
    </div>
</template>

<script>
import PresetTableOpts from './PresetTableOpts.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Dashboard',
  data () {
    return {
      columns: [
        {title: 'Id', key: 'id'},
        {title: 'Nome', key: 'name', sortable: true},
        {title: 'Valore', key: 'value'},
        {title: 'Attivo', key: 'enabled', sortable: true},
        {title: 'Azioni', key: 'actions', align: 'center', render: (h, params) => h(PresetTableOpts)}
      ]
    }
  },
  computed: {
    ...mapGetters(['presets', 'presetCount', 'askDeleteConfirmation'])
  },
  methods: {
    ...mapActions(['removePreset'])
  },
  created () {
    this.$store.dispatch('loadPresets')
  }
}
</script>

<style>
</style>
