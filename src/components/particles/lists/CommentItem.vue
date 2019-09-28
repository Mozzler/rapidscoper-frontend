<template>
  <div class="comment mb-3">
    <circular-loader
      cls="loader-shadow--without-padding transparent"
      :size="50"
      :width="5"
      :visible="processing"
    />
    <div class="comment__actions">
      <v-layout row fill-height align-center justify-space-between>
        <div v-if="!comment.parentCommentId">
          <v-btn icon v-if="!item.parentCommentId" @click="updateVisibility">
            <v-icon v-if="item.visibleToClient">visibility</v-icon>
            <v-icon v-else class="primary-icon">visibility_off</v-icon>
          </v-btn>
          <v-btn icon v-if="!comment.parentCommentId" @click="resolveComment">
            <v-icon v-if="comment.status === 'active'">check_circle_outline</v-icon>
            <v-icon v-else class="primary-icon">check_circle</v-icon>
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
    <v-layout align-start row fill-height>
      <v-flex>
        <v-textarea
          class="comment-textarea rapid-textarea"
          name="comment"
          v-model="comment.text"
          v-validate="'required|min:2|max:255'"
          label="Write a comment ..."
          :error-messages="errors.first('comment')"
          :disabled="!editable"
          :class="{'comment__textarea--editable': editable}"
          solo
          rows="1"
          auto-grow
        ></v-textarea>
      </v-flex>
      <v-flex shrink>
        <v-btn icon v-if="editable"
               class="ma-1"
               :style="{ 'color': 'green' }"
               @click="finishEdit">
          <v-icon>check</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import CommentOptions from '../menus/CommentOptions';
import CircularLoader from '../../particles/loaders/Circular';

import {
  mapState,
  mapMutations,
  mapActions
} from 'vuex';

export default {
  name: 'CommentItem',
  props: {
    item: {
      type: Object
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  components: {
    CommentOptions,
    CircularLoader
  },
  data () {
    return {
      editable: false,
      comment: null,
      processing: false
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
    ...mapActions('entity', [ 'update' ]),
    getPayload () {
      return {
        entity: 'comment',
        data: {
          id: this.comment.id
        },
        params: { id: this.comment.id }
      };
    },
    async initUpdate (data = {}) {
      this.processing = true;
      const payload = this.getPayload();
      _.assign(payload.data, data);
      await this.update(payload);
      this.processing = false;
    },
    updateVisibility () {
      this.comment.visibleToClient = !this.comment.visibleToClient;
      this.initUpdate({
        visibleToClient: this.comment.visibleToClient
      });
    },
    removeComment () {
      console.log('remove-comment');
    },
    resolveComment () {
      this.comment.status = this.comment.status === 'active' ? 'archived' : 'active';
      this.initUpdate({
        status: this.comment.status
      });
    },
    finishEdit () {
      this.editable = false;
      this.initUpdate({
        content: this.comment.text
      });
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
