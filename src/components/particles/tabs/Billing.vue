<template>
  <v-layout row wrap>
    <v-flex xs12 sm12 md7>
      <v-layout column wrap>
        <v-card class="billing-card mt-3">
          <div class="billing-card__title">Your Plan</div>
          <div>You are on a Basic Plan.</div>
          <div class="text-greyed billing-card__text">It's free forever.</div>
          <div class="billing-card__action" @click="showChangePlanModal = true">Change Plan</div>
        </v-card>
        <v-card class="billing-card mt-3">
          <div class="billing-card__title">Payment Details</div>
          <div>
            <master-card-icon class="billing-card__logo"/>
            <span class="ml-2">**** **** **** 4149</span>
          </div>
          <div class="billing-card__action">Update payment info</div>
        </v-card>
      </v-layout>
    </v-flex>
    <v-flex sm12 md5>
      <v-card class="billing-card mt-3"
              :class="{'ml-0': $vuetify.breakpoint.smAndDown, 'ml-3': $vuetify.breakpoint.mdAndUp}">
        <template v-if="!paid">
          <div class="billing-card__title">Upgrade to Premium</div>
          <div>Unlock all features of RapidScoper include unlimited projects and export by upgrading to Premium Subscription Plan</div>
          <v-btn large class="btn-rapid primary mt-4">
            Upgrade
          </v-btn>
        </template>
        <template v-else>
          <div class="billing-card__title">Next invoice</div>
          <div>5 users renew monthly on May 28, 2019</div>
          <div class="text-bold mt-4">$ 49.95</div>
          <div class="billing-card__action" @click="goTo">See past invoice</div>
        </template>
      </v-card>
    </v-flex>

    <change-plan-modal :show="showChangePlanModal"
      @close-modal="() => showChangePlanModal = false" />
  </v-layout>
</template>

<script>
import MasterCardIcon from '@/components/particles/icons/MasterCardIcon';
import ChangePlanModal from '@/components/particles/modals/ChangePlan';

export default {
  name: 'Billing',
  components: {
    MasterCardIcon,
    ChangePlanModal
  },
  data () {
    return {
      paid: true,
      showChangePlanModal: false
    };
  },
  methods: {
    goTo() {
      let path = `${this.$route.path}/past-invoice`;
      this.$router.push(path);
    }
  }
};
</script>

<style scoped>

</style>
