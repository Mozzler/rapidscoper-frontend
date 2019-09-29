<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" content-class="comment-modal" max-width="416" persistent>
      <v-card v-if="dialog" class="modal-card modal-card--short">
        <comment-history />
        <comment-writer @close-modal="closeModal"/>
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
