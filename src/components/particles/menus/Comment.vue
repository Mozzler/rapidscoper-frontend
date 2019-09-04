<template>
  <div
    v-if="comment.state"
    class="comment-dialog"
    ref="comment"
    @click="writeComment">
    <comment-icon class="mr-1"/>
    <span>Comment</span>
  </div>
</template>

<script>
import CommentIcon from '../icons/Comment';
import { mapState } from 'vuex';

export default {
  name: 'Comment',
  components: {
    CommentIcon
  },
  computed: {
    ...mapState('system', [
      'comment'
    ])
  },
  methods: {
    writeComment () {
      this.$root.$emit('write-comment');
    }
  },
  watch: {
    comment: {
      deep: true,
      handler () {
        let style = this.$refs.comment.style;
        style.top = `${this.comment.y}px`;
        style.left = `${this.comment.x}px`;
      }
    }
  }
};
</script>
