<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="416" persistent>
      <v-card class="modal-card">

        <div class="modal-header">
          <h1> Delete team </h1>
          <v-btn icon class="modal-close-btn" @click="closeModal">
            <v-icon>close</v-icon>
          </v-btn>
        </div>

        <v-card-text class="mt-3 padding-0">
          <v-layout row wrap>
            <v-flex xs12>
              Are you sure you want to delete
              <span class="text-bold"> {{ toTitle($route.params.name) }} </span>
            </v-flex>
            <v-flex xs12 mt-3>
              You will permanently lose all projects in this team, and you cannot undo this action.
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
                   @click="closeModal">
              Delete
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
  name: 'delete-team',
  mixins: [
    Navigation,
    ModalMixin
  ]
};
</script>
