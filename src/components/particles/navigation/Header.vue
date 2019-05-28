<template>
  <v-container class="header-container">
    <v-layout row wrap align-center>
      <v-flex xs6>
          <logo-rapid-scope class="app-logo"/>
      </v-flex>
      <v-flex xs6>
        <template v-if="!isAuthenticated">
          <p class="text-xs-right" v-if="isSignup">Already have an account?
            <router-link :to="'login'">Log In</router-link>
          </p>
          <p class="text-xs-right" v-else>Don't have an account?
            <router-link :to="'signup'">Sign Up</router-link>
          </p>
        </template>
        <template v-else>
          <p class="text-xs-right">
            <router-link to="/" @click.native="logout">Log Out</router-link>
          </p>
        </template>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import LogoRapidScope from '../icons/LogoRapidScope';
import * as authConst from '@/store/actions/auth';

export default {
  name: 'AppHeader',
  components: {
    LogoRapidScope
  },
  computed: {
    isSignup () {
      return this.$route.name === 'signup';
    },
    isAuthenticated () {
      return this.$store.getters[authConst.IS_AUTHENTICATED];
    }
  },
  methods: {
    async logout (event) {
      event.preventDefault();
      await this.$store.dispatch(authConst.AUTH_LOGOUT);
      this.$router.push('/signup');
    }
  }
};
</script>
