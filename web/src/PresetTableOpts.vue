<template>
  <div>
    <Button type="primary"><i class="fa fa-edit"></i></Button> 
    <Button type="error" @click.stop="deletePreset"><i class="fa fa-trash"></i></Button>
    <Modal
      v-model="askDeleteConfirmation"
      title="Rimozione preset"
      ok-text="Si"
      @on-ok="ok(item_id)"
      cancel-text="No"
      @on-cancel="cancel">
      <p>Sei sicuro di voler rimuovere il preset?</p>
    </Modal>
  </div>
</template>

<script>

import { mapActions } from 'vuex'

export default {
  props: ['item_id'],
  data () {
    return {
      askDeleteConfirmation: false
    }
  },
  created () {
    console.log(this.item_id)
  },
  methods: {
    deletePreset () {
      this.askDeleteConfirmation = true
    },
    ok (item_id) {
      this.$store.dispatch('deletePreset', item_id)
      this.$Message.success('Preset eliminato!')
    },
    cancel () {
      console.log("I've changed my mind")
      this.$Message.warning('Operazione annullata')
    }
  }
}
</script>

