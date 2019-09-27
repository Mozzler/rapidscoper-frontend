<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="416">
      <v-card class="modal-card modal-card--short">
        <div class="modal-header">
          <v-btn icon class="modal-close-btn" @click="setVisibility">
            <v-icon v-if="visible">visibility</v-icon>
            <v-icon class="primary-icon" v-else>visibility_off</v-icon>
          </v-btn>
        </div>

        <div class="comment__history">
          <div v-for="(item, index) in history" :key="index">
            <v-layout row fill-height>
              <v-flex shrink mr-2>
                <img class="comment__img"
                     :src="item.avatarUrl" />
              </v-flex>
              <v-flex grow>
                <v-layout column fill-height>
                  <div class="font-weight-bold"> {{ item.name }} </div>
                  <div class="comment__subtitle"> {{ item.time }} </div>
                </v-layout>
              </v-flex>
            </v-layout>
            <v-layout fill-height row mt-2>
              <v-flex>
                <div class="comment__text"> {{ item.text }} </div>
                <div class="comment__subtitle">1 reply</div>
              </v-flex>
            </v-layout>
          </div>
        </div>

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

import {
  mapState,
  mapGetters,
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
    },
    history () {
      return this.items('comment').find(comment => comment.id === this.comment.id);
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
    },
    setVisibility () {
      this.visible = !this.visible;
    }
  },
  watch: {
    dialog () {
      if (this.dialog) {
        console.log(this.items('comment'), this.comment);
      }
    }
  }
};
</script>
