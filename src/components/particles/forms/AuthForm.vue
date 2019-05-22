<template>
  <v-form class="signup-with-email">
    <v-layout row wrap>
      <v-flex xs12 class="signup-input">
        <v-text-field
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
      <v-btn class="primary submit-btn mt-5px" block large @click="submit">
        Sign Up with Email
      </v-btn>
    </v-layout>
  </v-form>
</template>

<script>

  import * as actionConst from '../../../store/actions/auth';

  export default {
    name: 'SignupForm',
    props: {
        type: {
          type: String,
          default: 'Sign Up',
          required: true
        }
    },
    data: () => ({
      user: {
        email: null,
        password: null
      },
      processing: false
    }),
    computed: {
      action() {
        return this.type === 'Sign Up' ? actionConst.AUTH_REGISTER : actionConst.AUTH_LOGIN;
      }
    },
    methods: {
      async submit() {
        this.processing = true;

        let result = await this.$validator.validate();

        if(result) {
          this.processing = true;
          await this.$store.dispatch(this.action, this.user);
          this.$router.push('/');
        }
        else {
          this.processing = false;
        }
      }
    }
  };
</script>
