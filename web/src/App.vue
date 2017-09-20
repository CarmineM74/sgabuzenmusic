<template>
  <div>
    <div class="container-fluid">
      <div class="navbar fixed-top navbar-default">
        <div class="navbar-header">
          <a href="#" class="navbar-brand">
            <img src="./assets/sgabuzen_music_logo.jpg" class="sgabuzen-logo" alt="" >
          </a>
        </div>
        <div>
          <ul class="nav navbar-nav">
            <li>
              <a href="#">Dashboard</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="container-fluid">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
    }
  }
}
</script>

<style>
  img.sgabuzen-logo {
    width: 24px;
    height: 24px;
  }
</style>
