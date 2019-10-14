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

      <text-field ref="user"
        :processing="processing"
        :model="data"
        :extra="{email: 'Verify Email'}"
        @secondary-click="verifyEmail"
        @update="update" />

      <text-field ref="password"
        :processing="processing"
        :model="password"
        @update="update" />

      <v-layout column class="account-settings__section-form">
        <v-flex class="text-reference"
          @click="deleteAccount">Delete account</v-flex>
        <v-flex class="mt-2">This account will no longer be available and all data in the account will be permanently deleted.</v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
import AccountSettingsHeader from '../../particles/navigation/AccountSettingsHeader';
import CircularLoader from '../../particles/loaders/Circular';
import TextField from '../../particles/inputs/TextField';

import { mapState, mapActions } from 'vuex';

export default {
  name: 'AccountSettings',
  components: {
    TextField,
    AccountSettingsHeader,
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
        password_confirmation: null
      }
    };
  },
  beforeMount () {
    this.init();
    window.addEventListener('keydown', this.submit);
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
    submit ($event) {
      if ($event.code === 'Enter') {
        this.save();
      }
    },
    init () {
      this.data = _.pick(this.user, 'firstName', 'lastName', 'email');
      this.password = {
        password: null,
        password_confirmation: null
      };
    },
    async deleteAccount () {
      this.processing = true;
      await this.updateUser({ status: 'archived' });
      this.logout();
      this.processing = false;
    },
    verifyEmail () {
      this.$root.$emit('verify-email', _.pick(this.data, 'email'));
    },
    update (data) {
      _.assign(this.data, data);
    },
    async save () {
      /*this.processing = true;

      const result = await Promise.all(this.validate());
      const validated = _.every(result, item => item === true);

      if (validated) {
        await this.updateUser(this.data);
      }

      this.processing = false;*/
      await this.$refs.password.$validator.validate();
      console.log(this.errors);
    },
    validate () {
      const sections = ['user', 'password'];
      return _.map(sections, (section) => {
        return this.$refs[section].$validator.validate();
      });
    },
    cancel () {
      this.$router.push('/dashboard/all-projects');
    }
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.submit);
  }
};
</script>
