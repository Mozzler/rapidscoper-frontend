<template>
  <v-app>
    <v-content class="theme--rapid" :class="{'padding-left--50': sidebarMini}">
      <router-view />
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'app',
  computed: {
    sidebarMini () {
      return this.$store.state.auth.minified;
    }
  }
};
</script>

<style lang="scss">
  @import 'assets/scss/index';
</style>
