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
    },
    authorized () {
      return this.$store.state.auth.user;
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
            action === 'login' ? this.login() : this.send('login');
          }
        }).catch(error => {
          const msg = { field: 'email', msg: error.message };
          this.errors.add(msg);
          this.processing = false;
        });
    },
    login () {
      this.$store.dispatch('auth/getInfo')
        .then(() => {
          const props = this.authorized.firstName && this.authorized.lastName;
          const url = !props ? '/create-account' : '/';

          this.$router.push(url);
          this.processing = false;
        }).catch(error => {
          console.log(error);
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
