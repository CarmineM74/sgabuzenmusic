<template>
  <div class="row">
    <div v-if="presetCount==0" class="col-md-12">
      <img src="./assets/Gear.gif" alt="gear" class="image-responsive center-block">
    </div>
    <div class="col-md-12 center-block" v-else>
      <button class="btn btn-primary"><i class="fa fa-plus"></i> Aggiungi preset</button>
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
            <td>
              <button class="btn btn-primary btn-sm"><i class="fa fa-edit" aria-hidden="true"></i></button>
              &nbsp
              <button class="btn btn-danger btn-sm" v-on:click="removePreset(preset.id)"><i class="fa fa-trash" aria-hidden="true"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="modal fade" v-modal="askDeleteConfirmation" id="deleteConfirmation" tabindex="-1" role="dialog">
      Sei sicuro di voler rimuovere il preset?
    </div>

  </div>
</template>

<script>
import BootstrapVue from 'bootstrap-vue'

import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Dashboard',
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
