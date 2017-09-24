<template>
  <div>
    <Button type="primary"><i class="fa fa-edit"></i></Button> 
    <Button type="error"><i class="fa fa-trash"></i></Button>
  </div>
</template>

<script>
export default {
  props: ['item_id'],
  created () {
    console.log(this.item_id)
  }
}
</script>

