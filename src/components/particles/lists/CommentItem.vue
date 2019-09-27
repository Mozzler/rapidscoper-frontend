<template>
  <div class="comment">
    <div class="comment__actions">
      <v-layout row fill-height align-center justify-space-between>
        <div v-if="!comment.parentCommentId">
          <v-btn icon v-if="!item.parentCommentId"
                 @click="updateVisibility">
            <v-icon v-if="item.visibleToClient">visibility</v-icon>
            <v-icon class="primary-icon" v-else>visibility_off</v-icon>
          </v-btn>
          <v-btn icon v-if="!comment.parentCommentId"
                 @click="resolveComment">
            <v-icon>check</v-icon>
          </v-btn>
        </div>
        <comment-options
          v-if="comment.id && item.createdBy === user.user_id"
          @edit-mode="editable = true"
          @delete-mode="removeComment" />
      </v-layout>
    </div>
    <v-layout row fill-height>
      <v-flex shrink mr-2>
        <img class="comment__img"
             :src="comment.avatarUrl" />
      </v-flex>
      <v-flex grow>
        <v-layout column fill-height>
          <div> {{ comment.name }} </div>
          <div class="comment__subtitle"> {{ comment.time }} </div>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout align-start justify-center row fill-height mt-2>
      <v-flex>
        <div class="comment__text" :contenteditable="editable"
          :class="{'comment__text--editable': editable}">
          {{ comment.text }}
        </div>
      </v-flex>
      <v-flex shrink>
        <v-btn icon v-if="editable"
               @click="editable = false">
          <v-icon>check</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import CommentOptions from '../menus/CommentOptions';

import {
  mapState,
  mapMutations
} from 'vuex';

export default {
  name: 'CommentItem',
  props: [
    'item'
  ],
  components: {
    CommentOptions
  },
  data () {
    return {
      editable: false,
      comment: null
    };
  },
  computed: {
    ...mapState({
      user: state => state.auth.user
    })
  },
  beforeMount () {
    this.comment = this.item;
  },
  methods: {
    ...mapMutations('entity', [
      'update'
    ]),
    updateVisibility () {
      this.update({
        entity: 'comment',
        data: {
          id: this.comment.id,
          visibleToClient: !this.comment.visibleToClient
        },
        params: this.comment.id
      });
    },
    removeComment () {
      console.log('remove-comment');
    },
    resolveComment () {
      console.log('resolve-comment');
    }
  },
  watch: {
    item: {
      deep: true,
      handler () {
        this.comment = this.item;
      }
    }
  }
};
</script>
