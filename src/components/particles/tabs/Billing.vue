<template>
  <v-layout row wrap>
    <v-flex xs12 sm12 md7>
      <v-layout column wrap>
        <v-card class="billing-card">
          <div class="billing-card__title">Your Plan</div>
          <div>You are on a Basic Plan.</div>
          <div class="text-greyed billing-card__text">It's free forever.</div>
          <div class="billing-card__action">Change Plan</div>
        </v-card>
        <v-card class="billing-card">
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
      <v-card class="billing-card offset">
        <div class="billing-card__title">Upgrade to Premium</div>
        <div>Unlock all features of RapidScoper include unlimited projects and export by upgrading to Premium Subscription Plan</div>
        <v-btn large class="btn-rapid primary mt-4">
          Upgrade
        </v-btn>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import MasterCardIcon from '@/components/particles/icons/MasterCardIcon';

export default {
  name: 'Billing',
  components: {
    MasterCardIcon
  },
  data () {
    return {

    };
  }
};
</script>

<style scoped>

</style>
