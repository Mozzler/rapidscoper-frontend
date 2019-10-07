<template>
  <v-container class="header-container">
    <v-layout row wrap align-center>
      <v-flex xs6>
          <logo-rapid-scope class="app-logo"/>
      </v-flex>
      <v-flex xs6>
        <template v-if="!isAuthenticated">
          <p class="text-xs-right" v-if="isSignup">Already have an account?
            <router-link :to="'/login'">Log In</router-link>
          </p>
          <p class="text-xs-right" v-else>Don't have an account?
            <router-link :to="'/signup'">Sign Up</router-link>
          </p>
        </template>
        <template v-else>
          <p class="text-xs-right">
            <router-link to="/" @click.native.prevent="logout">Log Out</router-link>
          </p>
        </template>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import LogoRapidScope from '../icons/LogoRapidScope';
import { mapState } from "vuex";

export default {
  name: 'AppHeader',
  components: {
    LogoRapidScope
  },
  computed: {
    ...mapState({
      user: state => state.auth.user
    }),
    isSignup () {
      return this.$route.name === 'signup';
    },
    isAuthenticated () {
      return this.user;
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('auth/logout')
        .then(() => {
          this.$router.push('/login');
        });
    }
  }
};
</script>
