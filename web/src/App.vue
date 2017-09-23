<template>
  <div class="layout">
    <Row type="flex">
      <Col span="4" class="layout-menu-left">
        <Menu theme="dark" width="auto">
          <div class="layout-logo-left">
            <img src="./assets/sgabuzen_music_logo.jpg" class="sgabuzen-logo" alt="logo">
            <span class="motto">Sgabuzen Music</span>
          </div>
          <MenuItem name="dashboard">Dashboard</MenuItem>
        </Menu>
      </Col>
      <Col span="20">
        <div class="layout-content">
          <router-view></router-view>
        </div>
      </Col>
    </Row>
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
      position: relative;
  }
  .layout-menu-left{
      background: #464c5b;
  }
  .layout-header{
      height: 60px;
      background: #fff;
      box-shadow: 0 1px 1px rgba(0,0,0,.1);
  }
  .layout-logo-left{
      width: 90%;
      height: 30px;
      background: #5b6270;
      border-radius: 3px;
      margin: 15px auto;
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
    margin-left: 10px;
  }
  .sgabuzen-logo {
    width: 30px;
    height: 30px;
  }

</style>
