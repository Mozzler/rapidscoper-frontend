<template>
  <div
    ref="comment"
    class="comment-dialog"
    :class="{'comment-dialog--invisible': !show}"
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
    ]),
    isCommentsTab () {
      return this.$route.params.tab === 'comments';
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
  },
  watch: {
    comment: {
      deep: true,
      async handler () {
        if (!this.comment.precomment) {
          this.show = false;
          return;
        }

        this.show = this.comment.state;

        await this.$nextTick();

        const style = this.$refs.comment.style;
        style.top = `${this.comment.y}px`;
        style.left = `${this.comment.x}px`;
      }
    },
    isCommentsTab () {
      if (!this.isCommentsTab) {
        this.show = false;
        this.setComment({ state: null });
      }
    }
  }
};
</script>
