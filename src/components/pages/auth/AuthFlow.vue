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
            <create-team v-if="$route.name === 'create-team'"/>
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
import CreateTeam from '../../particles/forms/CreateTeam';
import AppHeader from '../../particles/navigation/Header';

export default {
  name: 'AuthDataPage',
  components: {
    ForgotPasswordForm,
    ChangePasswordForm,
    CreateAccountForm,
    AcceptInviteForm,
    CreateTeam,
    AppHeader
  }
};
</script>
