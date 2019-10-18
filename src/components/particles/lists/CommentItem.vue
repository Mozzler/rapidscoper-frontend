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
          <comment-option-button
            :visible="!item.parentCommentId"
            :click-handler="updateVisibility"
            :icon-visible="item.visibleToClient"
            :text="item.visibleToClient ? 'Hide from Client' : 'Show to Client'"
            icon-if="visibility"
            icon-else="visibility_off"
          />
          <comment-option-button
            :visible="!item.parentCommentId"
            :click-handler="resolveComment"
            :icon-visible="comment.status === 'active'"
            :text="comment.status === 'active' ? 'Resolve' : 'Unresolve'"
            :onboarding="true"
            icon-if="check_circle_outline"
            icon-else="check_circle"
          />
        </div>
        <comment-options
          v-if="comment.id && item.createdBy === user.user_id && comment.status !== 'deleted'"
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
      <v-flex v-if="comment.status !== 'deleted'">
        <v-textarea
          class="comment-textarea rapid-textarea"
          name="comment"
          v-model="comment.content"
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
      <v-flex v-else class="text-greyed mt-2">
        Delete the comment
      </v-flex>
      <v-flex shrink>
        <v-btn icon v-if="editable"
               class="ma-1"
               :style="{ 'color': 'green' }"
               @click="send">
          <v-icon>check</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <assignment-menu
      v-if="editable"
      ref="assignment"
      :content="comment.content"
      :reassign="!!comment.parentCommentId"/>
  </div>
</template>

<script>
import CommentOptions from '../menus/CommentOptions';
import CircularLoader from '../loaders/Circular';
import CommentOptionButton from '../buttons/CommentOptionButton';
import AssignmentMenu from '../menus/AssignmentMenu';

import AssignmentMixin from '@/mixins/assignment';

import {
  mapState,
  mapActions
} from 'vuex';

export default {
  name: 'CommentItem',
  mixins: [
    AssignmentMixin
  ],
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
    CommentOptionButton,
    CircularLoader,
    AssignmentMenu
  },
  data () {
    return {
      editable: false,
      comment: null,
      processing: false,
      continue: 'finishEdit'
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
    ...mapActions('entity', {
      update: 'update',
      remove: 'delete'
    }),
    getPayload (data = {}, additional = {}) {
      return {
        entity: 'comment',
        params: { id: this.comment.id },
        ...data,
        ...additional
      };
    },
    async initAction (data = {}, action = 'update', additional = {}) {
      this.processing = true;
      const payload = this.getPayload({ data: data }, additional);
      await this[action](payload);
      this.processing = false;
    },
    updateVisibility () {
      this.comment.visibleToClient = !this.comment.visibleToClient;
      this.initAction({
        visibleToClient: this.comment.visibleToClient
      });
    },
    resolveComment () {
      this.comment.status = this.comment.status === 'active' ? 'resolved' : 'active';
      this.initAction({
        status: this.comment.status
      });
    },
    finishEdit () {
      this.editable = false;
      this.initAction({
        content: this.comment.content
      });
    },
    removeComment () {
      this.editable = false;
      //this.initAction({}, 'remove', { id: this.comment.id });
      this.comment.status = 'deleted';
      this.initAction({
        status: this.comment.status
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
