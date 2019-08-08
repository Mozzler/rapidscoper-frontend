<template>
  <div class="header">
    <v-layout align-center justify-space-between row fill-height>
      <v-flex>
        <div class="logo-container">
          <logo-rapid-scope />
        </div>
      </v-flex>
      <v-flex text-sm-center>
        <div class="text-size--16 font-weight-regular cursor-default">
          <span class="font-weight-bold">{{ info.projectName }}</span> |
          <span>Version: {{ info.version }}</span> |
          <span>{{ info.created }}</span>
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
    })
  }
};
</script>
