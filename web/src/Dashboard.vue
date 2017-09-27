<template>
    <Row type="flex" justify="center" align="middle" v-if="(presetCount==0) || loading">
      <img src="./assets/Gear.gif" alt="gear" class="gear">
    </Row>
    <div v-else>
      <Row type="flex">
        <Col span="24">
          <Button type="primary" @click="newPreset"><i class="fa fa-plus"></i> Aggiungi preset</Button>
          <Button @click="loadPresets"><i class="fa fa-refresh"></i> Aggiorna elenco preset</Button>
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
import EnabledStatusGlyph from './EnabledStatusGlyph.vue'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'Dashboard',
  data () {
    return {
      columns: [
        {title: 'Nome', key: 'name', sortable: true},
        {title: 'Valore', key: 'configuration', width: 100, align: 'center'},
        {title: 'Attivo',
          key: 'enabled',
          sortable: true,
          width: 80,
          align: 'center',
          render: (h, params) => h(EnabledStatusGlyph, { props: { status: params.row.enabled } })
        },
        {title: 'Azioni',
          key: 'actions',
          align: 'center',
          width: 150,
          render: (h, params) => h(PresetTableOpts, {props: {itemId: params.row.name}})
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['presetCount']),
    ...mapState(['presets', 'loading'])
  },
  methods: {
    ...mapActions(['loadPresets']),
    newPreset () {
      this.$router.push('/new')
    }
  },
  created () {
    console.log('Creating Dashboard ...')
    this.loadPresets()
  }
}
</script>

<style>
</style>
