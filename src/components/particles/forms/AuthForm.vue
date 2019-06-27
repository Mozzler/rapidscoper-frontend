<template>
  <v-form class="signup-with-email" @keyup.native.enter="submit">
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
        <v-btn class="btn-rapid primary submit-btn mt-5px"
               block large
               @click="submit"
               :disabled="processing"
        > {{ type }} with Email </v-btn>
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
    },
    route () {
      return this.type === 'Sign Up' ? '/create-account' : '/';
    }
  },
  methods: {
    async submit () {
      this.processing = true;

      let result = await this.$validator.validate();
      result ? this.send() : this.processing = false;
    },
    send (action = this.action) {
      this.$store.dispatch(`auth/${action}`, this.user)
        .then(response => {
          if (!response.error) {
            if (action === 'signup') {
              this.send('login');
            } else if (action !== this.action) {
              this.$router.push('/create-account');
            } else {
              this.$router.push('/');
            }
          }
          this.processing = false;
        }).catch(error => {
          this.errors.add({field: 'email', msg: error.message});
          this.processing = false;
        });
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
