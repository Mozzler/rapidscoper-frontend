<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="416">
      <v-card class="modal-card">
        <div class="modal-header">
          <v-layout row fill-height align-center>
            <img
              class="comment__img mr-2"
              :src="info ? info.avatarUrl : null" />
            <span>{{ info ? info.name : null }}</span>
          </v-layout>
          <v-btn icon class="modal-close-btn">
            <v-icon>visibility</v-icon>
          </v-btn>
        </div>

        <v-card-text class="mt-4 padding-0">
          <div>
            <circular-loader
              cls="loader-shadow--without-padding transparent"
              :size="50"
              :width="5"
              :visible="processing"
            />

            <v-layout row>
              <v-flex grow>
                <v-text-field class="full-width"
                              name="message"
                              v-model="message"
                              v-validate="'required|min:6|max:255'"
                              placeholder="Write a comment..."
                              :error-messages="errors.first('message')"
                              solo
                ></v-text-field>
              </v-flex>
              <v-flex shrink pl-3 v-if="!isMobileDevice">
                <v-btn class="btn-rapid primary" large
                       @click="send">
                  Send
                </v-btn>
              </v-flex>
            </v-layout>
            <v-flex shrink class="text-xs-right" v-if="isMobileDevice">
              <v-btn class="btn-rapid primary" large
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

import { mapState, mapGetters } from 'vuex';

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
      message: ''
    };
  },
  computed: {
    ...mapState('auth', [
      'user'
    ]),
    ...mapGetters('entity', [
      'items'
    ]),
    userInfo () {
      return this.items('userInfo');
    },
    info () {
      return _.find(this.userInfo, info => info.userId === this.user.user_id);
    }
  },
  methods: {
    initData () {
      this.message = '';
    },
    send () {

    }
  }
};
</script>
