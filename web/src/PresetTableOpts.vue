<template>
  <div>
    <Button type="primary" @click.stop="editPreset(itemId)"><i class="fa fa-edit"></i></Button> 
    <Button type="error" @click.stop="confirmDelete"><i class="fa fa-trash"></i></Button>
    <Modal
      v-model="askDeleteConfirmation"
      title="Rimozione preset"
      ok-text="Si"
      @on-ok="ok(itemId)"
      cancel-text="No"
      @on-cancel="cancel">
      <p>Sei sicuro di voler rimuovere il preset?</p>
    </Modal>
  </div>
</template>

<script>

import { mapActions } from 'vuex'

export default {
  props: ['itemId'],
  data () {
    return {
      askDeleteConfirmation: false
    }
  },
  created () {
    console.log('PresetTableOpts for', this.itemId)
  },
  methods: {
    ...mapActions(['deletePreset']),
    editPreset (itemId) {
      this.$router.push({path: `/edit/${itemId}`})
    },
    confirmDelete () {
      this.askDeleteConfirmation = true
    },
    ok (itemId) {
      this.deletePreset(itemId)
      this.$Message.success('Preset eliminato!')
    },
    cancel () {
      console.log("I've changed my mind")
      this.$Message.warning('Operazione annullata')
    }
  }
}
</script>

