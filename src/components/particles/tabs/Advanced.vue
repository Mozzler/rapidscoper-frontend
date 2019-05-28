<template>
  <div>
    <delete-team-modal :show="showDeleteTeamModal"
                       @close-modal="showDeleteTeamModal = false" />
    <v-flex xs12 sm12 md7>
      <v-card class="billing-card mt-3">
        <div class="billing-card__title">Delete team</div>
        <div>After deleting, you and the rest team members will lose access to all team projects.</div>
        <div class="billing-card__action" @click="showDeleteTeamModal = true">Delete team</div>
      </v-card>
    </v-flex>
  </div>
</template>

<script>
import MasterCardIcon from '@/components/particles/icons/MasterCardIcon';
import DeleteTeamModal from '@/components/particles/modals/DeleteTeam';

export default {
  name: 'Billing',
  components: {
    MasterCardIcon,
    DeleteTeamModal
  },
  data () {
    return {
      paid: true,
      showDeleteTeamModal: false
    };
  },
  methods: {
    goTo() {
      let path = `${this.$route.path}/past-invoice`;
      this.$router.push(path);
    }
  },
  computed: {
    isMobileDevice() {
      return this.$store.state.auth.isMobileDevice;
    }
  }
};
</script>

<style scoped>

</style>
