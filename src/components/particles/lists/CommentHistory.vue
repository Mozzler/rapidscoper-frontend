<template>
  <div v-if="primary">
    <comment-item :item="primary"/>
    <div v-for="(comment, index) in primary.replies" :key="index">
      <comment-item :item="comment"/>
    </div>
    <v-divider
      class="my-3 comment__divider" />
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
    primary () {
      return _.find(this.comments, c => c && c.id === this.comment.id);
    }
  }
};
</script>
