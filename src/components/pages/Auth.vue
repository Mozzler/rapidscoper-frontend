<template>
  <div class="signup-section">
    <v-container fluid>
      <v-layout row wrap>
        <v-flex  offset-xs2 xs8 offset-sm3 sm6 offset-md4 md4>
          <v-container pa-0 class="signup-container">
            <h1 class="sign-up-header">{{ authType }}</h1>
            <v-btn block class="social" large>
              <logo-google class="social-button-icon"/>
              <span>{{ authType }} With Google</span>
            </v-btn>
            <v-btn block class="social" large>
              <logo-git-hub class="social-button-icon"/>
              {{ authType }} With Github
            </v-btn>
            <p class="signup-text-1" v-if="emailFormVisible">
              Or just <a href="" @click="showEmailForm">{{ authType }} with Email</a>
            </p>
            <auth-form v-else :type="authType"/>
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
import AuthForm from '../particles/forms/AuthForm';

export default {
  name: 'Signup',
  components: {
    LogoGitHub,
    LogoGoogle,
    AuthForm
  },
  data: () => ({
    emailFormVisible: false
  }),
  computed: {
    authType() {
      return this.$route.name === 'signup' ? 'Sign Up' : 'Log In';
    }
  },
  methods: {
    showEmailForm($event) {
      $event.preventDefault();
      this.emailFormVisible = true;
    }
  }
};
</script>
