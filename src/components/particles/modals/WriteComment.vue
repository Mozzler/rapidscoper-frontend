<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="416">
      <v-card class="modal-card modal-card--short">
        <div class="modal-header">
          <v-layout row fill-height align-center>
            <img
              class="comment__img mr-2"
              :src="info ? info.avatarUrl : null" />
            <span>{{ info ? info.name : null }}</span>
          </v-layout>
          <v-btn icon class="modal-close-btn" @click="setVisibility">
            <v-icon v-if="visible">visibility</v-icon>
            <v-icon class="primary-icon" v-else>visibility_off</v-icon>
          </v-btn>
        </div>

        <v-card-text class="mt-3 padding-0">
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

import {
  mapState,
  mapGetters,
  mapMutations,
  mapActions
} from 'vuex';

export default {
  name: 'write-comment',
  components: {
    CircularLoader
  },
  mixins: [
    ModalMixin
  ],
  data () {
    return {
      content: '',
      visible: true,
      processing: false
    };
  },
  computed: {
    ...mapState('auth', [
      'user'
    ]),
    ...mapGetters('entity', [
      'items'
    ]),
    ...mapState('system', [
      'comment'
    ]),
    userInfo () {
      return this.items('userInfo');
    },
    info () {
      return _.find(this.userInfo, info => info.userId === this.user.user_id);
    }
  },
  methods: {
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
        parentCommentId: null,
        storyId: comment.item.id,
        sectionId: comment.item.sectionId,
        teamId: comment.item.teamId,
        projectId: comment.item.projectId
      };

      const response = await this.create({
        entity: 'comment',
        data: payload
      });

      let splitted = comment.markup.split('<span')
        .filter(item => item)
        .map(item => item.includes('span>') ? `<span${item}` : item);

      let first = _.first(splitted).replace(/<span[^>]*>/, '');
      let last = _.last(splitted).replace('<\/span>', '');

      if (splitted.length >= 2) {
        splitted[0] = first;
        splitted[splitted.length - 1] = last;

        comment.markup = splitted.join('');
      }

      let text = `<span class="commented-text" data-comment-id="${response.item.id}">${comment.markup}</span>`;
      let markup = comment.item.markup.replace(comment.markup, text);

      await this.update({
        entity: 'story',
        data: {
          markup: markup
        },
        params: {
          id: comment.item.id
        }
      });

      this.processing = false;
      this.closeModal();
    },
    setVisibility () {
      this.visible = !this.visible;
    }
  }
};
</script>
