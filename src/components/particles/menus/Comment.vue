<template>
  <div
    ref="comment"
    class="comment-dialog"
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
  data () {
    return {
      show: false
    };
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
      async handler () {
        this.show = this.comment.state;

        await this.$nextTick();

        const style = this.$refs.comment.style;
        style.top = `${this.comment.y}px`;
        style.left = `${this.comment.x}px`;
      }
    }
  }
};
</script>
