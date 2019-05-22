<template>
  <v-container pa-0 class="signup-container">
    <h1 class="sign-up-header">Change Password</h1>
    <v-form>
      <v-layout row wrap>
        <label class="form-label">
          Enter a new password
        </label>
        <v-flex xs12 class="signup-input">
          <v-text-field
            key="change-password-email"
            name="email"
            v-validate="'required|email|min:6|max:255'"
            v-model="user.email"
            placeholder="Email"
            :error-messages="errors.first('email')"
            :disabled="processing"
            solo
          ></v-text-field>
        </v-flex>
        <v-flex xs12 class="signup-input">
          <v-text-field
            key="change-password"
            name="password"
            v-validate="'required|min:6|max:255'"
            v-model="user.password"
            placeholder="Password"
            :error-messages="errors.first('password')"
            :type="'password'"
            :disabled="processing"
            solo
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-btn class="primary submit-btn mt-5px" block large @click="reset">
            Change password
          </v-btn>
        </v-flex>
      </v-layout>
    </v-form>
  </v-container>
</template>

<script>

  import * as actionConst from '../../../store/actions/auth';

  export default {
    name: 'ForgotPasswordForm',
    data: () => ({
      user: {
        email: null,
        password: null
      },
      processing: false,
    }),
    methods: {
      async reset() {
        this.processing = true;

        let result = await this.$validator.validate();

        if(result) {
          this.processing = true;
          /*this.$store.dispatch(this.action, this.user)
            .then(() => {
            });*/
        }
        else {
          this.processing = false;
        }
      },
    },
  };
</script>
