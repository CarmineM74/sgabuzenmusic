<template>
  <div class="row">
    <div v-if="presetCount==0" class="col-md-12">
      <img src="./assets/Gear.gif" alt="gear" class="image-responsive center-block">
    </div>
    <div class="col-md-12 center-block" v-else>
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Valore</th>
            <th>Abilitato</th>
            <th>Operazioni</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="preset in presets" key="preset.id">
            <td>{{preset.id}}</td>
            <td>{{preset.name}}</td>
            <td>{{preset.value}}</td>
            <td>{{preset.enabled}}</td>
            <td>EDIT / DELETE</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters(['presets', 'presetCount'])
  },
  created () {
    this.$store.dispatch('loadPresets')
  }
}
</script>
