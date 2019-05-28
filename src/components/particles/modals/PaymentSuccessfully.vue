<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="416">
      <v-card class="modal-card">

        <div class="modal-header">
          <h1>
            <v-layout row align-content-center fill-height justify-start>
              <v-flex class="header-icon" shrink>
                <v-icon>check_circle</v-icon>
              </v-flex>
              <v-flex>
                Payment successful!
              </v-flex>
            </v-layout>
          </h1>
            <v-btn icon class="modal-close-btn" @click="closeModal">
              <v-icon>close</v-icon>
            </v-btn>
        </div>

        <v-card-text class="mt-4 padding-0">
          <v-layout row wrap>
            <v-flex xs12>
              Thank You! Your payment was successful! You can view the invoice in the list.
            </v-flex>
          </v-layout>
          <v-flex shrink mt-4 :class="{
            'text-xs-right': !isMobileDevice,
            'text-xs-center': isMobileDevice }">
            <v-btn class="btn-rapid primary" large @click="closeModal">
              Go to Dashboard
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
    name: "payment-successfully",
    mixins: [
      Navigation,
      ModalMixin
    ],
  }
</script>
