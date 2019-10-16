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
import { mapActions } from 'vuex';

export default {
  name: 'ForgotPasswordForm',
  data: () => ({
    user: {
      email: null,
      password: null
    },
    processing: false
  }),
  beforeMount () {
    this.fetchData();
  },
  computed: {
    params () {
      return this.$route.params;
    }
  },
  methods: {
    ...mapActions('entity', [
      'details'
    ]),
    async reset () {
      this.processing = true;

      let result = await this.$validator.validate();

      if (result) {
        this.processing = true;
        return;
      }

      this.processing = false;
    },
    async fetchData () {
      this.processing = true;
      await this.details({
        id: this.params.inviteId,
        code: this.params.inviteCode
      });
      this.processing = false;
    }
  }
};
</script>
