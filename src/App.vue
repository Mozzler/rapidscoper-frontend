<template>
  <v-app>
    <v-content class="theme--rapid" :class="{'padding-left--50': sidebarMini}">
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

export default {
  name: 'app',
  components: {
    InviteUserModal,
    CreateProjectModal,
    DeleteTeamModal,
    ChangePlanModal,
    DowngradeToBasicModal,
    UpgradeToPremiumModal,
    PaymentInfoModal,
    PaymentSuccessfullyModal,
    IncorrectDataModal
  },
  mixins: [
    ResizeMixin
  ],
  computed: {
    sidebarMini () {
      return this.$store.state.auth.minified;
    },
    authenticated() {
      return this.$store.state.auth.is_authenticated;
    }
  },
};
</script>

<style lang="scss">
  @import 'assets/scss/index';
</style>
