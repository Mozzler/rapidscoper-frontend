<template>
  <div
    ref="comment"
    class="comment-dialog"
    :class="{'comment-dialog--invisible': !comment.state}"
    @click="writeComment">
    <comment-icon class="mr-1"/>
    <span>Comment</span>
  </div>
</template>

<script>
import CommentIcon from '../icons/Comment';
import { mapState, mapMutations } from 'vuex';

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
    ...mapMutations('system', [
      'setComment'
    ]),
    writeComment () {
      this.setComment({
        state: null
      });
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
