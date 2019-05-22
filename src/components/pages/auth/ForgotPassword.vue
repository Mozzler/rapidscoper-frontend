<template>
  <div class="signup-section">
    <v-container fluid>
      <v-layout row wrap>
        <v-flex  offset-xs2 xs8 offset-sm3 sm6 offset-md4 md4>
          <forgot-password-form v-if="$route.name === 'forgot-password'"/>
          <change-password-form v-if="$route.name === 'change-password'"/>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  import ForgotPasswordForm from '../../particles/forms/ForgotPasswordForm';
  import ChangePasswordForm from '../../particles/forms/ChangePasswordForm';
  import * as actionConst from '../../../store/actions/auth';

  export default {
    name: 'SignupForm',
    components: {
      ForgotPasswordForm,
      ChangePasswordForm
    },
  };
</script>
