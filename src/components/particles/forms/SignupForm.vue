<template>
  <v-form class="signup-with-email">
    <v-layout row wrap>
      <v-flex xs12 class="mb-5px">
        <v-text-field
          v-model="user.email"
          placeholder="Email"
          solo
        ></v-text-field>
      </v-flex>
      <v-flex xs12 class="mb-5px">
        <v-text-field
          v-model="user.password"
          placeholder="Password"
          solo
        ></v-text-field>
      </v-flex>
      <v-btn class="primary submit-btn mt-5px" block large>
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
      }
    }),
    methods: {

    }
  };
</script>
