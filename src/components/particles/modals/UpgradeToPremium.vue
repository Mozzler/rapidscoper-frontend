<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="416">
      <v-card class="modal-card">

        <div class="modal-header">
          <h1> Upgrade to Premium </h1>
          <v-btn icon class="modal-close-btn" @click="closeModal">
            <v-icon>close</v-icon>
          </v-btn>
        </div>

        <v-card-text class="mt-3 padding-0">
          <v-layout row wrap>
            <v-flex xs12>
              The minimum payment for Premium Plan is $ 50/m.
            </v-flex>
            <v-flex xs12 mt-3>
              You can invite up to 5 users without changing the price.
            </v-flex>
          </v-layout>
          <v-flex shrink mt-4 :class="{
            'text-xs-right': !isMobileDevice,
            'text-xs-center': isMobileDevice }">
            <v-btn class="btn-rapid mr-3" large outline
                   @click="closeModal">
              Cancel
            </v-btn>
            <v-btn class="btn-rapid primary" large
                   @click="showPaymentInfoModal">
              Upgrade
            </v-btn>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import Navigation from '@/mixins/navigation';
  import ModalMixin from '@/mixins/modal';

  export default {
    name: "upgrade-to-premium",
    mixins: [
      Navigation,
      ModalMixin
    ],
    methods: {
      showPaymentInfoModal() {
        this.closeModal();
        this.$root.$emit('payment-info');
      }
    }
  }
</script>
