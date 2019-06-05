<template>
  <div>
    <app-header/>
    <div class="signup-section">
      <v-container fluid>
        <v-layout row wrap>
          <v-flex  offset-xs2 xs8 offset-sm3 sm6 offset-md4 md4>
            <v-container pa-0 class="signup-container">
              <h1 class="sign-up-header">{{ authType }}</h1>
              <v-btn block large @click="signupWithGoogle"
                     class="btn-rapid social">
                <logo-google class="social-button-icon"/>
                <span>{{ authType }} With Google</span>
              </v-btn>
              <v-btn block class="btn-rapid social" large @click="signupWithGithub">
                <logo-git-hub class="social-button-icon"/>
                {{ authType }} With Github
              </v-btn>
              <p class="signup-text-1" v-if="emailFormVisible && authType === 'Sign Up'">
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
  </div>
</template>

<script>
import LogoGitHub from '../../particles/icons/LogoGitHub';
import LogoGoogle from '../../particles/icons/LogoGoogle';
import AuthForm from '../../particles/forms/AuthForm';
import AppHeader from '../../particles/navigation/Header';

export default {
  name: 'AuthTypePage',
  components: {
    LogoGitHub,
    LogoGoogle,
    AuthForm,
    AppHeader
  },
  data: () => ({
    emailFormVisible: null
  }),
  computed: {
    authType () {
      return this.$route.name === 'signup' ? 'Sign Up' : 'Log In';
    }
  },
  beforeMount () {
    this.emailFormVisible = this.authType === 'Sign Up';
  },
  methods: {
    showEmailForm ($event) {
      $event.preventDefault();
      this.emailFormVisible = false;
    },
    signupWithGoogle ($event) {
      this.$gAuth.signIn()
        .then(user => {
          let data = {
            firstname: user.w3.ofa,
            lastname: user.w3.wea,
            access_token: user.Zi.access_token,
            id_token: user.Zi.id_token,
            email: user.w3.U3
          };
          /*this.$store.dispatch(actionConst.AUTH_REGISTER, data)
            .then(() => {
              this.$router.push('/');
            })
            .catch(error => {
              console.log();
            });*/
        })
        .catch(error => {
          console.log(error);
        });
    },
    signupWithGithub () {

    }
  },
  watch: {
    '$route.name' () {
      this.emailFormVisible = true;
    }
  }
};
</script>
