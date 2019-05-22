<template>
  <v-container class="header-container">
    <v-layout row wrap align-center>
      <v-flex xs6>
          <logo-rapid-scope class="app-logo"/>
      </v-flex>
      <v-flex xs6>
          <p class="text-xs-right">Already have an account?
            <a href="http://www.google.com">Log In</a>
          </p>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import LogoRapidScope from './icons/LogoRapidScope';

export default {
  name: 'AppHeader',
  components: {
    LogoRapidScope
  },
  data: () => ({

  }),
  methods: {
  }
};
</script>
