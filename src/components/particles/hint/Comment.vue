<template>
  <div
    ref="comment"
    class="comment-dialog"
    :class="{'comment-dialog--invisible': !visible}"
    @click="writeComment">
    <comment-icon class="mr-1"/>
    <span>Comment</span>
  </div>
</template>

<script>
import CommentIcon from '../icons/Comment';
import { mapMutations } from 'vuex';

export default {
  name: 'Comment',
  components: {
    CommentIcon
  },
  props: {
    visible: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    ...mapMutations('system', [
      'setComment'
    ]),
    writeComment () {
      this.setComment({ state: null });
      this.$root.$emit('write-comment');
    }
  }
};
</script>
