<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="416">
      <v-card class="modal-card modal-card--short">
        <comment-history v-if="dialog"/>
        <v-divider class="my-3 comment__divider" />
        <v-card-text class="padding-0">
          <div class="mb-3">
            <v-layout row fill-height align-center>
              <img
                class="comment__img mr-2"
                :src="info ? info.avatarUrl : null" />
              <span>{{ info ? info.name : null }}</span>
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
                <div :class="{'input-group rapid-textarea': !isMobileDevice}">
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
            <v-flex shrink class="text-xs-right" v-if="isMobileDevice">
              <v-btn class="btn-rapid primary" large
                     :disabled="processing"
                     @click="send">
                Send
              </v-btn>
            </v-flex>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import ModalMixin from '@/mixins/modal';
import CircularLoader from '../../particles/loaders/Circular';
import CommentHistory from '../../particles/lists/CommentHistory';

import {
  mapState,
  mapGetters,
  mapActions,
  mapMutations
} from 'vuex';

export default {
  name: 'write-comment',
  components: {
    CircularLoader,
    CommentHistory
  },
  mixins: [
    ModalMixin
  ],
  data () {
    return {
      content: '',
      visible: true,
      processing: false,
      history: []
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
    },
    async send () {
      let comment = { ...this.comment };
      this.processing = true;

      let payload = {
        status: 'active',
        content: this.content,
        visibleToClient: this.visible,
        parentCommentId: this.comment.id,
        storyId: comment.item.id,
        sectionId: comment.item.sectionId,
        teamId: comment.item.teamId,
        projectId: comment.item.projectId
      };

      const response = await this.create({
        entity: 'comment',
        data: payload
      });

      await this.update({
        entity: 'story',
        data: {
          markup: comment.markup.replace(/~~~/g, response.item.id)
        },
        params: {
          id: comment.item.id
        }
      });

      this.processing = false;
      this.closeModal();
    }
  }
};
</script>
