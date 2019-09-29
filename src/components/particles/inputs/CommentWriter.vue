<template>
  <v-card-text class="padding-0">
    <div class="mb-3 comment">
      <v-layout row fill-height align-center>
        <img
          class="comment__img mr-2"
          :src="info ? info.avatarUrl : null" />
        <span>{{ info ? info.name : null }}</span>
        <div class="comment__actions" v-if="!comment.id">
          <v-btn icon
                 @click="visibleToClient = !visibleToClient">
            <v-icon v-if="visibleToClient">visibility</v-icon>
            <v-icon class="primary-icon" v-else>visibility_off</v-icon>
          </v-btn>
        </div>
      </v-layout>
    </div>
    <div>
      <circular-loader
        cls="loader-shadow--without-padding transparent"
        :size="50"
        :width="5"
        :visible="processing"
      />

      <v-layout row>
        <v-flex>
          <div class="input-group rapid-textarea">
            <v-textarea
              name="comment"
              v-model="content"
              v-validate="'required|min:2|max:255'"
              label="Write a comment ..."
              :error-messages="errors.first('comment')"
              solo
              rows="1"
              auto-grow
            ></v-textarea>
          </div>
        </v-flex>

        <v-flex shrink pl-3 v-if="!isMobileDevice">
          <v-btn class="btn-rapid primary" large
                 :disabled="processing"
                 @click="send">
            Send
          </v-btn>
        </v-flex>
      </v-layout>
      <assignment-menu
        ref="assignment"
        :content="content"
        :reassign="!!comment.id" />
    </div>
  </v-card-text>
</template>

<script>
import CircularLoader from '../loaders/Circular';
import AssignmentMenu from '../menus/AssignmentMenu';
import AssignmentMixin from '@/mixins/assignment';

import {
  mapState,
  mapGetters,
  mapActions,
  mapMutations
} from 'vuex';

export default {
  name: 'CommentWriter',
  mixins: [
    AssignmentMixin
  ],
  components: {
    AssignmentMenu,
    CircularLoader
  },
  data () {
    return {
      content: '',
      visibleToClient: true,
      processing: false,
      continue: 'dispatch'
    };
  },
  computed: {
    ...mapState({
      user: state => state.auth.user,
      comment: state => state.system.comment
    }),
    ...mapGetters({
      items: 'entity/items'
    }),
    userInfo () {
      return this.items('userInfo');
    },
    info () {
      return _.find(this.userInfo, info => info.userId === this.user.user_id);
    }
  },
  beforeMount () {
    this.initData();
  },
  methods: {
    ...mapMutations('system', [
      'setComment'
    ]),
    ...mapActions('entity', [
      'create',
      'update'
    ]),
    initData () {
      this.content = '';
      this.visible = true;
      this.$validator.reset();
    },
    updateStoryMarkup (markup, commentId, storyId) {
      const data = {
        entity: 'story',
        data:   { markup: markup.replace(/~~~/g, commentId) },
        params: { id: storyId }
      };

      return this.update(data);
    },
    async dispatch () {
      const { item, markup, id } = this.comment;

      let payload = {
        status: 'active',
        content: this.content,
        visibleToClient: this.visibleToClient,
        parentCommentId: id,
        storyId: item.id,
        sectionId: item.sectionId,
        teamId: item.teamId,
        projectId: item.projectId
      };

      const response = await this.create({
        entity: 'comment',
        data: payload
      });

      if (!id) { // if master comment - not comment within chain
        await this.updateStoryMarkup(markup, response.item.id, item.id);
      }

      this.processing = false;
      this.$emit('close-modal');
    }
  }
};
</script>
