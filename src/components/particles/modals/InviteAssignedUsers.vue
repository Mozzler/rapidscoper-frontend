<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="416" persistent>
      <v-card class="modal-card">
        <circular-loader
          cls="loader-shadow--without-padding transparent"
          :size="50"
          :width="5"
          :visible="processing"
        />

        <div class="modal-header">
          <h1> Invite user </h1>
          <v-btn icon class="modal-close-btn" @click="closeModal">
            <v-icon>close</v-icon>
          </v-btn>
        </div>

        <v-card-text class="padding-0">
          <p class="mt-3">Some users do not have access and should be invited:</p>
          <v-layout
            class="mb-3"
            v-for="(user, index) in assigned"
            :key="index"
            row fill-height align-center justify-space-between>
            <v-flex shrink class="invited__flex">
              <div>{{ user.email }}</div>
            </v-flex>
            <v-flex shrink class="invited__flex">
              <dropdown
                :list="roles"
                :selected="user.role"
                @update="value => user.role = value" />
            </v-flex>
          </v-layout>
          <v-flex shrink mt-4 :class="{
            'text-xs-right': !isMobileDevice,
            'text-xs-center': isMobileDevice }">
            <v-btn class="btn-rapid mr-3" large outline @click="closeModal">
              Cancel
            </v-btn>
            <v-btn class="btn-rapid primary" large
                   :disabled="processing"
                   @click="submit">
              Invite
            </v-btn>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import Dropdown from '../menus/Dropdown';
import ModalMixin from '@/mixins/modal';
import CircularLoader from '../loaders/Circular';

import {
  mapState,
  mapMutations
} from 'vuex';

export default {
  name: 'invite-assigned-users',
  mixins: [
    ModalMixin
  ],
  components: {
    Dropdown,
    CircularLoader
  },
  data () {
    return {
      assigned: null
    };
  },
  computed: {
    ...mapState('system', [
      'roles'
    ])
  },
  methods: {
    ...mapMutations('system', [
      'submitComment'
    ]),
    initData () {
      this.assigned = _.map(this.params, email => {
        return {
          email: email,
          role: _.first(this.roles)
        };
      });
    },
    getRequestData (user) {
      return {
        entity: 'invite',
        data: {
          entityId: this.$route.params.projectId,
          entityType: 'project',
          expiry: null,
          role: user.role.type,
          email: user.email
        },
        cancelCommit: true
      };
    },
    submit () {
      this.processing = true;
      const requests = [];

      _.each(this.assigned, user => {
        const data = this.getRequestData(user);
        requests.push(this.$store.dispatch('entity/create', data));
      });

      Promise.all(requests).then((responses) => {
        _.each(responses, response => {
          this.commitChanges(response.item, response.userInfo);
        });
        this.submitComment(true);
        this.processing = false;
        this.closeModal();
      }).catch(errors => {
        _.each(errors, error => {
          let msg = _.first(error.response.data);
          this.$root.$emit('show-error-message', msg.message);
        });
        this.processing = false;
      });
    },
    commitChanges (item, userInfo) {
      this.$store.commit('entity/create', {
        entity: 'invite',
        data: item
      });
      this.$store.commit('entity/create', {
        entity: 'userInfo',
        data: userInfo
      });
    }
  }
};
</script>
