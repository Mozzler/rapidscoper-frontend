<template>
  <v-flex xs10 offset-xs1>
    <v-layout align-center justify-space-between row fill-height class="top-header">
      <logo-rapid-scope />
      <v-btn class="btn-rapid" large outline @click="goBack">Go Back</v-btn>
    </v-layout>
  </v-flex>
</template>

<script>
  import LogoRapidScope from "../icons/LogoRapidScope";
  export default {
    name: "TopHeader",
    components: {LogoRapidScope},
    methods: {
      goBack() {
        this.$router.go(-1);
      }
    }
  }
</script>

<style scoped>

</style>
