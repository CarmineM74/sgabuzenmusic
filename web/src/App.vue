<template>
  <div class="layout">
    <Menu mode="horizontal" theme="dark" width="auto">
      <div class="layout-logo"></div>
      <span class="motto">Sgabuzen Music</span>
    </Menu>
    <div class="layout-content">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style>
  .layout{
      border: 1px solid #d7dde4;
      background: #f5f7f9;
  }
  .layout-logo{
      width: 30px;
      height: 30px;
      background-image: url('./assets/sgabuzen_music_logo.jpg');
      background-size: 30px;
      border-radius: 3px;
      float: left;
      position: relative;
      top: 15px;
      left: 20px;
  }
  .layout-nav{
      width: 420px;
      margin: 0 auto;
  }
  .layout-content{
      min-height: 200px;
      margin: 15px;
      overflow: hidden;
      background: #fff;
      border-radius: 4px;
  }
  .motto {
    color: white;
    vertical-align: top;
    margin-left: 40px;
  }
  .sgabuzen-logo {
    width: 30px;
    height: 30px;
  }

</style>
