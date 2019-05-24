<template>
  <v-layout row wrap align-center>
    <v-flex xs7>
      <v-card class="billing-card">
        <div class="billing-card__title">Your Plan</div>
        <div>You are on a Basic Plan.</div>
        <div class="text-greyed billing-card__text">It's free forever.</div>
        <div class="billing-card__action">Change Plan</div>
      </v-card>
      <v-card class="billing-card">
        <div class="billing-card__title">Payment Details</div>
        <div>You are on a Basic Plan.</div>
        <div class="mt-3">
          <master-card-icon />
          <span class="ml-2">**** **** **** 4149</span>
        </div>
        <div class="billing-card__action">Update payment info</div>
      </v-card>
    </v-flex>
    <v-flex xs5>
      <v-card class="billing-card">
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
  import MasterCardIcon from '@/components/particles/icons/MasterCardIcon'

  export default {
    name: "Billing",
    components: {
      MasterCardIcon
    },
    data() {
      return {

      }
    },
  }
</script>

<style scoped>

</style>
