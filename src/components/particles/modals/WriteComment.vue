<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="416">
      <v-card class="modal-card modal-card--short">
        <comment-history v-if="dialog"/>
        <comment-writer />
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import ModalMixin from '@/mixins/modal';
import CommentWriter from '../../particles/inputs/CommentWriter';
import CommentHistory from '../../particles/lists/CommentHistory';

export default {
  name: 'write-comment',
  components: {
    CommentWriter,
    CommentHistory
  },
  mixins: [
    ModalMixin
  ]
};
</script>
