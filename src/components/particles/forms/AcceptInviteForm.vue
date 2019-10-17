<template>
  <v-container pa-0 class="signup-container">
    <h1 class="sign-up-header">Accept Invite</h1>
    <v-form class="position-relative">
      <circular-loader
        cls="loader-shadow--without-padding transparent"
        :size="50"
        :width="5"
        :visible="!user"
      />
      <v-layout row wrap v-if="user">
        <img :src="user.inviterUserInfo.avatarUrl" />
        <v-flex xs12>
          <div class="invitation__text">
            {{ user.inviterUserInfo.name }}
          </div>
        </v-flex>
        <v-flex xs12>
          <div class="invitation__date">
            on {{ user.invite.createdAt | toStrDate }} invited you as a {{ roleByType(user.invite.role) }} to join
          </div>
        </v-flex>
        <v-flex xs12>
          <div class="invitation__project">
            {{ user.project.name }}
          </div>
        </v-flex>
        <v-flex xs12 v-if="!accepted">
          <v-btn class="btn-rapid invitation__btn primary submit-btn mt-5px" large
            @click="accept">
            Accept
          </v-btn>
        </v-flex>
        <v-flex xs12 v-if="!accepted">
          <router-link :to="'/'" class="invitation__decline">Decline</router-link>
        </v-flex>
        <auth-form v-else type="Sign Up" :email="user.invite.email" />
      </v-layout>
    </v-form>
  </v-container>
</template>

<script>
import CircularLoader from '../loaders/Circular';
import AuthForm from './AuthForm';

import { mapState, mapActions } from 'vuex';

export default {
  name: 'ForgotPasswordForm',
  components: {
    CircularLoader,
    AuthForm
  },
  data: () => ({
    user: null,
    accepted: false
  }),
  filters: {
    toStrDate (str) {
      return moment.unix(str).format('MMM D, YYYY');
    }
  },
  beforeMount () {
    this.fetchData();
  },
  computed: {
    ...mapState('system', [
      'roles'
    ]),
    params () {
      return this.$route.params;
    }
  },
  methods: {
    ...mapActions('entity', [
      'details'
    ]),
    roleByType (type) {
      const role = _.find(this.roles, role => role.type === type);
      return role ? role.name : null;
    },
    accept () {
      this.accepted = true;
    },
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
      this.user = await this.details({
        id: this.params.inviteId,
        code: this.params.inviteCode
      });
    }
  }
};
</script>
