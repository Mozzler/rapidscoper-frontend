<template>
  <v-app>
    <v-content class="theme--rapid">
      <router-view />
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'app',
};
</script>

<style lang="scss">
  @import 'assets/scss/index';
</style>
