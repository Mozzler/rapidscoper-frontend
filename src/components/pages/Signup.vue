<template>
  <div class="app">
    <v-container fluid>
      <v-layout row wrap>
        <v-flex  offset-xs2 xs8 offset-sm3 sm6 offset-md4 md4>
          <v-container pa-0 class="signup-container">
            <h1 class="sign-up-header">Sign up</h1>
            <v-btn block class="social">
              <logo-google class="social-button-icon"/>
              <span>Sign Up With Google</span>
            </v-btn>
            <v-btn block class="social">
              <logo-git-hub class="social-button-icon"/>
              Sign Up With Github
            </v-btn>
            <p class="signup-text-1">Or just <a href="http://www.google.com">Sign Up with Email</a></p>
            <p class="signup-text-2">By continuing, you agree to our
              <a href="http://www.google.com">Terms of Service</a>
              and
              <a href="http://www.google.com">Privacy&nbsp;Policy</a>
            </p>
          </v-container>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import LogoGitHub from '../particles/icons/LogoGitHub';
import LogoGoogle from '../particles/icons/LogoGoogle';

export default {
  name: 'Signup',
  components: {
    LogoGitHub,
    LogoGoogle
  },
  data: () => ({})
};
</script>

<style lang="scss" scoped>
  .signup-container {
    max-width: 410px;
    .social-button-icon {
      margin: 0px 8px;
      width: 16px;
      height: 16px;
    }
    .signup-text-1 {
      margin: 25px 0px 0px 0px;
    }
    .signup-text-2 {
      margin: 63px 0px 0px 0px;
    }
  }
</style>
