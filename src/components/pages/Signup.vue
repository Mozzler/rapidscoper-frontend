<template>
  <div class="signup-section">
    <v-container fluid>
      <v-layout row wrap>
        <v-flex  offset-xs2 xs8 offset-sm3 sm6 offset-md4 md4>
          <v-container pa-0 class="signup-container">
            <h1 class="sign-up-header">Sign Up</h1>
            <v-btn block class="social" large>
              <logo-google class="social-button-icon"/>
              <span>Sign Up With Google</span>
            </v-btn>
            <v-btn block class="social" large>
              <logo-git-hub class="social-button-icon"/>
              Sign Up With Github
            </v-btn>
            <p class="signup-text-1" v-if="emailFormVisible">
              Or just <a href="" @click="showEmailForm">Sign Up with Email</a>
            </p>
            <signup-form v-else/>
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
import SignupForm from '../particles/forms/SignupForm';

export default {
  name: 'Signup',
  components: {
    LogoGitHub,
    LogoGoogle,
    SignupForm
  },
  data: () => ({
    emailFormVisible: false
  }),
  methods: {
    showEmailForm($event) {
      $event.preventDefault();
      this.emailFormVisible = true;
    }
  }
};
</script>
