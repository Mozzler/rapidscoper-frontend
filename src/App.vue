<template>
  <v-app>
    <v-content class="theme--rapid">
      <router-view />
    </v-content>

    <template v-if="authenticated">
      <change-plan-modal />
      <create-project-modal />
      <delete-team-modal />
      <downgrade-to-basic-modal />
      <invite-user-modal />
      <upgrade-to-premium-modal />
      <payment-info-modal />
      <payment-successfully-modal />
      <incorrect-data-modal />
      <share-project-modal />
      <settings-modal />
      <write-comment />
    </template>
  </v-app>
</template>

<script>
import ResizeMixin from '@/mixins/resize';

import InviteUserModal from '@/components/particles/modals/InviteUser';
import CreateProjectModal from '@/components/particles/modals/CreateProject';
import DeleteTeamModal from '@/components/particles/modals/DeleteTeam';
import ChangePlanModal from '@/components/particles/modals/ChangePlan';
import DowngradeToBasicModal from '@/components/particles/modals/DowngradeToBasic';
import UpgradeToPremiumModal from '@/components/particles/modals/UpgradeToPremium';
import PaymentInfoModal from '@/components/particles/modals/PaymentInfo';
import PaymentSuccessfullyModal from '@/components/particles/modals/PaymentSuccessfully';
import IncorrectDataModal from '@/components/particles/modals/IncorrectData';
import ShareProjectModal from '@/components/particles/modals/ShareProject';
import SettingsModal from '@/components/particles/modals/Settings';
import WriteComment from '@/components/particles/modals/WriteComment';

export default {
  name: 'app',
  components: {
    WriteComment,
    InviteUserModal,
    CreateProjectModal,
    DeleteTeamModal,
    ChangePlanModal,
    DowngradeToBasicModal,
    UpgradeToPremiumModal,
    PaymentInfoModal,
    PaymentSuccessfullyModal,
    IncorrectDataModal,
    ShareProjectModal,
    SettingsModal
  },
  mixins: [
    ResizeMixin
  ],
  created () {
    this.$socket.init();
  },
  beforeMount () {
    this.initConnect();
  },
  computed: {
    user () {
      return this.$store.state.auth.user;
    },
    authenticated () {
      return this.user !== null;
    }
  },
  beforeDestroy () {
    this.$socket.disconnect();
  },
  methods: {
    initConnect () {
      if (this.authenticated && this.user.access_token) {
        this.connect('user', 'auth/update');
        this.connect('userInfo', 'entity/setList');
        this.connect('team', 'entity/setList');
      }
    }
  },
  watch: {
    authenticated () {
      this.initConnect();
    }
  }
};
</script>

<style lang="scss">
  @import 'assets/scss/index';
</style>
