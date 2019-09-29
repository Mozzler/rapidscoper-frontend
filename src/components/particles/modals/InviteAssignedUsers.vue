<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="416" persistent>
      <v-card class="modal-card">
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
                   @click="invite">
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
    Dropdown
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
    async submit (user) {
      try {
        const data = this.getRequestData(user);
        const response = await this.$store.dispatch('entity/create', data);

        this.$store.commit('entity/create', {
          entity: 'invite',
          data: response.item
        });
        this.$store.commit('entity/create', {
          entity: 'userInfo',
          data: response.userInfo
        });
      } catch (error) {
        let msg = _.first(error.response.data);
        this.$root.$emit('show-error-message', msg.message);
      }
    },
    invite () {
      this.processing = true;

      _.each(this.assigned, async (item) => {
        await this.submit(item);
      });

      this.processing = false;
      this.closeModal();
      this.submitComment(true);
    }
  }
};
</script>
