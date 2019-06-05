<template>
  <v-form class="signup-with-email">
    <v-layout row wrap>
      <v-flex xs12 class="signup-input">
        <v-text-field
          :key="`${action}-email`"
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
          :key="`${action}-password`"
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
        <v-btn class="btn-rapid primary submit-btn mt-5px" block large @click="submit">
          {{ type }} with Email
        </v-btn>
      </v-flex>
      <v-flex xs12 v-if="type !== 'Sign Up'">
        <p class="forgot-link">
          <router-link :to="'forgot-password'">
            Forgot Password
          </router-link>
        </p>
      </v-flex>
    </v-layout>
  </v-form>
</template>

<script>

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
    action () {
      return this.type === 'Sign Up' ? 'signup' : 'login';
    }
  },
  methods: {
    async submit () {
      this.processing = true;

      let result = await this.$validator.validate();
      result ? this.handleRequest() : this.processing = false;
    },
    async send () {
      const response = await this.$store.dispatch(this.action, this.user);

      if (!response.error) {
        this.$router.push('/');
      }
      else {
        this.errors.add({ field: 'email', msg: response.error_description });
        this.processing = false;
      }
    },
    handleRequest () {
      if (this.type === 'Log In') {
        this.send();
      }
      else {
        this.$router.push('/create-account');
      }
    }
  },
  watch: {
    action () {
      this.user = {
        email: null,
        password: null
      };
    }
  }
};
</script>
