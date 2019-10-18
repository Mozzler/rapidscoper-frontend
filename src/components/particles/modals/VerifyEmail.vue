<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="416" persistent>
      <v-card class="modal-card">

        <div class="modal-header">
          <h1>
            Verify Email
          </h1>
          <v-btn icon class="modal-close-btn" @click="closeModal">
            <v-icon>close</v-icon>
          </v-btn>
        </div>

        <v-card-text class="mt-4 padding-0">
          <v-layout row wrap>
            <v-flex xs12>
              To verify your email we will send you a verification email.
            </v-flex>
          </v-layout>
          <v-flex shrink mt-4 :class="{
            'text-xs-right': !isMobileDevice,
            'text-xs-center': isMobileDevice }">
            <v-btn class="btn-rapid mr-3" large outline @click="closeModal">
              Close
            </v-btn>
            <v-btn class="btn-rapid primary" large @click="closeModal">
              Send Email
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
  name: 'verify-email',
  mixins: [
    Navigation,
    ModalMixin
  ]
};
</script>
