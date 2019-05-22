<template>
  <v-container class="header-container">
    <v-layout row wrap align-center>
      <v-flex xs6>
          <logo-rapid-scope class="app-logo"/>
      </v-flex>
      <v-flex xs6>
          <p class="text-xs-right" v-if="isSignup">Already have an account?
            <router-link :to="'login'">Log In</router-link>
          </p>
        <p class="text-xs-right" v-else>Don't have an account?
          <router-link :to="'signup'">Sign Up</router-link>
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
  },
  computed: {
    isSignup() {
      return this.$route.name === 'signup';
    }
  },
};
</script>
