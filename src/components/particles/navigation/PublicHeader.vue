<template>
  <div class="header">
    <v-layout align-center justify-space-between row fill-height>
      <v-flex class="align-center">
        <div class="logo-container">
          <router-link to="/" class="d-flex">
            <logo-rapid-scope />
          </router-link>
        </div>
      </v-flex>
      <v-flex text-sm-center>
        <div class="text-size--16 font-weight-regular cursor-default">
          <span class="font-weight-bold">{{ info.projectName }}</span> |
          <span>Version: {{ info.version }}</span> |
          <span>{{ info.version === 0 ? current : info.created }}</span>
        </div>
      </v-flex>
      <v-flex text-xs-right />
    </v-layout>
  </div>
</template>

<script>
import LogoRapidScope from "../icons/LogoRapidScope";
import { mapGetters } from 'vuex';

export default {
  name: "PublicHeader",
  components: { LogoRapidScope },
  computed: {
    ...mapGetters({
      info: 'projectVersion/info'
    }),
    current () {
      return moment().format("HH:mm A");
    }
  },
  created () {
    document.title = `${this.info.projectName} - Rapidscoper`;
  }
};
</script>
