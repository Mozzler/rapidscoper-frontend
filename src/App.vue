<template>
  <v-app>
    <v-content class="theme--rapid">
      <app-header/>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import AppHeader from './components/particles/Header';

export default {
  name: 'app',
  components: {
    AppHeader
  }
};
</script>

<style lang="scss">
  @import 'assets/scss/index';
</style>
