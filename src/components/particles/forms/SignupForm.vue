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
          solo
          :type="'password'"
        ></v-text-field>
      </v-flex>
      <v-btn class="primary submit-btn mt-5px" block large @click="submit">
        Sign Up with Email
      </v-btn>
    </v-layout>
  </v-form>
</template>

<script>


  export default {
    name: 'SignupForm',
    data: () => ({
      user: {
        email: null,
        password: null
      },
    }),
    methods: {
      submit() {
        let result = this.$validator.validate();
        console.log(this.errors);
      }
    }
  };
</script>
