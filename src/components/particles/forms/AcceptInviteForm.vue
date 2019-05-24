<template>
  <v-container pa-0 class="signup-container">
    <h1 class="sign-up-header">Accept Invite</h1>
    <v-form>
      <v-layout row wrap>
        <img src="@/assets/img/user.png" />
        <v-flex xs12>
          <div class="invitation__text">
            Jennifer Foster
          </div>
        </v-flex>
        <v-flex xs12>
          <div class="invitation__date">
            on May 6, 2019 invited you to join
          </div>
        </v-flex>
        <v-flex xs12>
          <div class="invitation__project">
            Skellorbit
          </div>
        </v-flex>
        <v-flex xs12>
          <v-btn class="btn-rapid invitation__btn primary submit-btn mt-5px" large>
            Accept
          </v-btn>
        </v-flex>
        <v-flex xs12>
          <router-link :to="'/'" class="invitation__decline">Decline</router-link>
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
    processing: false
  }),
  methods: {
    async reset () {
      this.processing = true;

      let result = await this.$validator.validate();

      if (result) {
        this.processing = true;
        /* this.$store.dispatch(this.action, this.user)
            .then(() => {
            }); */
      } else {
        this.processing = false;
      }
    }
  }
};
</script>
