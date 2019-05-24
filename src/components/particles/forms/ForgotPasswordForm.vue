<template>
  <v-container pa-0 class="signup-container">
    <h1 class="sign-up-header">Forgot Password</h1>
    <v-form>
      <v-layout row wrap>
        <label class="form-label">
          {{ label }}
        </label>
        <template v-if="!sent">
          <v-flex xs12 class="signup-input">
            <v-text-field
              name="email"
              v-validate="'required|email|min:6|max:255'"
              v-model="email"
              placeholder="Email"
              :error-messages="errors.first('email')"
              :disabled="processing"
              solo
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-btn class="btn-rapid primary submit-btn mt-5px" block large @click="reset">
              Send reset link
            </v-btn>
          </v-flex>
          <v-flex xs12>
            <p class="forgot-link">
              <router-link :to="'login'">
                Back to login
              </router-link>
            </p>
          </v-flex>
        </template>
        <template v-else>
          <v-flex xs12>
            <router-link to="/forgot-password" @click.native="resend">
              Resend reset link
            </router-link>
          </v-flex>
        </template>
      </v-layout>
    </v-form>
  </v-container>
</template>

<script>

import * as actionConst from '../../../store/actions/auth';

export default {
  name: 'ForgotPasswordForm',
  data: () => ({
    email: null,
    label: null,
    processing: false,
    sent: false
  }),
  beforeMount () {
    this.label = 'Enter your Email address and we will send you a link to reset your password.';
  },
  methods: {
    async reset () {
      this.processing = true;

      let result = await this.$validator.validate();

      if (result) {
        this.processing = true;
        /* this.$store.dispatch(this.action, this.user)
            .then(() => {
            }); */

        this.sent = true;
        this.label = 'Check your inbox and click the link to reset your password. In case you couldn’t find the email in your inbox, please check your spam folder.';
      } else {
        this.processing = false;
      }
    },
    resend ($event) {
      /* this.$store.dispatch(this.action, this.user)
          .then(() => {
          }); */
    }
  }
};
</script>
