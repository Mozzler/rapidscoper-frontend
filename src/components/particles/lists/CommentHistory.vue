<template>
  <div class="comment__history">
    <comment-item :item="master"/>
    <div v-for="(comment, index) in chain" :key="index">
      <comment-item :item="comment"/>
    </div>
  </div>
</template>

<script>

import {
  mapState,
  mapGetters
} from 'vuex';
import CommentItem from './CommentItem';

export default {
  name: 'CommentHistory',
  components: { CommentItem },
  props: {
    dialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: true
    };
  },
  computed: {
    ...mapState('system', [ 'comment' ]),
    ...mapGetters({
      commentList: 'entity/comments'
    }),
    comments () {
      return this.commentList();
    },
    master () {
      return _.find(this.comments, c => c && c.id === this.comment.id);
    },
    chain () {
      return _.filter(this.comments, c => c && c.parentCommentId === this.comment.id);
    }
  }
};
</script>
