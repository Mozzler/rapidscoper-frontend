<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="416">
      <v-card class="modal-card">

        <div class="modal-header">
          <h1> Downgrade to Basic </h1>
          <v-btn icon class="modal-close-btn" @click="() => $emit('close-modal')">
            <v-icon>close</v-icon>
          </v-btn>
        </div>

        <v-card-text class="mt-3 padding-0">
          <v-layout row wrap>
            <v-flex xs12>
              After downgrading, you will lose access to all your projects except the last modified one.
            </v-flex>
            <v-flex xs12 mt-3>
              Inaccessible projects will be deleted after 10 days.
            </v-flex>
          </v-layout>
          <v-flex shrink mt-4 :class="{
            'text-xs-right': !isMobileDevice,
            'text-xs-center': isMobileDevice }">
            <v-btn class="btn-rapid mr-3" large outline
                   @click="() => $emit('close-modal')">
              Cancel
            </v-btn>
            <v-btn class="btn-rapid primary" large
                   @click="() => $emit('close-modal')">
              Downgrade
            </v-btn>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import Navigation from '@/mixins/navigation';
  import Modal from '@/mixins/modal';

  export default {
    name: "DowngradeToBasic",
    mixins: [
      Navigation,
      Modal
    ],
  }
</script>
