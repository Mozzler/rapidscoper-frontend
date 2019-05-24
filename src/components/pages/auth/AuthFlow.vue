<template>
  <div>
    <app-header/>
    <div class="signup-section">
      <v-container fluid>
        <v-layout row wrap>
          <v-flex  offset-xs2 xs8 offset-sm3 sm6 offset-md4 md4>
            <forgot-password-form v-if="$route.name === 'forgot-password'"/>
            <change-password-form v-if="$route.name === 'change-password'"/>
            <create-account-form v-if="$route.name === 'create-account'"/>
            <accept-invite-form v-if="$route.name === 'accept-invite'"/>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>

<script>
import ForgotPasswordForm from '../../particles/forms/ForgotPasswordForm';
import ChangePasswordForm from '../../particles/forms/ChangePasswordForm';
import CreateAccountForm from '../../particles/forms/CreateAccountForm';
import AcceptInviteForm from '../../particles/forms/AcceptInviteForm';
import AppHeader from '../../particles/Header';

export default {
  name: 'AuthDataPage',
  components: {
    ForgotPasswordForm,
    ChangePasswordForm,
    CreateAccountForm,
    AcceptInviteForm,
    AppHeader
  }
};
</script>
