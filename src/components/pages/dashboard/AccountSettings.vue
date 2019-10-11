<template>
  <div class="account-settings">
    <account-settings-header
      :processing="processing"
      @save="save"
      @cancel="cancel" />

    <div class="account-settings__section">
      <circular-loader
        cls="loader-shadow--without-padding transparent"
        :size="50"
        :width="5"
        :visible="processing"
      />

      <account-settings-form ref="password"
        :processing="processing"
        :data="data"
        @update="update"/>

      <v-layout column>
        <v-flex class="text-reference"
          @click="deleteAccount">Delete account</v-flex>
        <v-flex class="mt-2">This account will no longer be available and all data in the account will be permanently deleted.</v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
import AccountSettingsHeader from '../../particles/navigation/AccountSettingsHeader';
import AccountSettingsForm from '../../particles/forms/AccountSettingsForm';
import CircularLoader from '../../particles/loaders/Circular';

import { mapState, mapActions } from 'vuex';

export default {
  name: 'AccountSettings',
  components: {
    AccountSettingsHeader,
    AccountSettingsForm,
    CircularLoader
  },
  data () {
    return {
      processing: false,
      data: {
        firstName: null,
        lastName: null,
        email: null
      },
      password: {
        password: null,
        confirmation: null
      }
    };
  },
  beforeMount () {
    this.init();
  },
  computed: {
    ...mapState('auth', [
      'user'
    ])
  },
  methods: {
    ...mapActions({
      updateUser: 'auth/update'
    }),
    init () {
      this.data = _.pick(this.user, 'firstName', 'lastName', 'email');
      this.password = {
        password: null,
        confirmation: null
      };
    },
    deleteAccount () {
      console.log('delete account');
    },
    verifyEmail () {
      console.log('verify email');
      //this.$root.$emit('verify-email', _.pick(this.data, 'email'));
    },
    update (data) {
      _.assign(this.data, data);
    },
    async save () {
      this.processing = true;
      await this.updateUser(this.data);
      this.processing = false;
    },
    cancel () {
      this.$router.push('/dashboard/all-projects');
    }
  }
};
</script>
