<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="608" persistent
              @keydown.enter.prevent.exact="$refs['invite-group'].invite">
      <v-card class="modal-card">

        <circular-loader
          cls="loader-shadow--without-padding transparent"
          :size="50"
          :width="5"
          :visible="processing || updating"
        />

        <div class="modal-header">
          <h1>Share</h1>
          <v-btn icon class="modal-close-btn" @click="closeModal">
            <v-icon>close</v-icon>
          </v-btn>
        </div>

        <v-card-text class="mt-3 padding-0">
          <v-flex align-self-center>
            <template v-if="!shared">
              <v-layout align-center justify-start row fill-height>
                <link-disabled-icon class="mr-3"/>
                <span class="cursor-default">Public link access is disabled.&nbsp;</span>
                <span class="text-reference" @click="enable">Enable access</span>
              </v-layout>
            </template>
            <template v-else>
              <v-layout align-center justify-space-between fill-height>
                <div>
                  <link-icon class="mr-3"/>
                  <span class="text-reference" @click="() => copy()">
                    Copy public link
                  </span>
                </div>
                <div>
                  <v-layout row align-center justify-space-between fill-height>
                    <dropdown class="mr-3"
                      :list="periods"
                      :selected="shared.expiry"
                      @update="value => updatePeriod(value)" />
                    <div @click="remove">
                      <v-icon class="cursor-pointer">delete</v-icon>
                    </div>
                  </v-layout>
                </div>
              </v-layout>
              <input class="input--hidden" :ref="'link'"/>
            </template>
          </v-flex>
          <v-divider
            class="my-3" />
          <v-flex>
            <div v-if="processing" class="text-greyed text-sm-center">
              Loading ...
            </div>
            <template v-else>
              <div
                v-if="!invited.length"
                class="text-sm-center text-greyed">
                There are no invited users yet
              </div>
              <div v-else>
                <v-layout
                  class="mb-3"
                  v-for="user in invited"
                  :key="user.id"
                  row fill-height align-center justify-space-between>
                  <v-flex shrink class="invited__flex">
                    <img
                      class="invited__img"
                      :src="user.avatarUrl" />
                    <div>{{ user.email }}</div>
                  </v-flex>
                  <v-flex shrink class="invited__flex">
                    <dropdown
                      :list="roles"
                      :selected="user.role"
                      @update="value => updateRole(value, user.id)" />
                    <v-icon
                      class="ml-3"
                      @click="() => removeInvite(user.id)"
                    >delete</v-icon>
                  </v-flex>
                </v-layout>
              </div>
            </template>
          </v-flex>
          <v-divider
            class="my-3" />
          <v-flex>
            <v-layout align-center justify-space-between>
              <v-flex grow>
                <span class="cursor-default">Client's permission</span>
              </v-flex>
              <v-flex shrink>
                <dropdown
                  :list="permissions"
                  :selected="clientPermissions"
                  @update="value => updatePermission(value)" />
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex grow mt-5>
            <invite-group
              v-if="dialog"
              :ref="`invite-group`"
              :entityId="params"
              :entityType="`project`" />
          </v-flex>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import ModalMixin from '@/mixins/modal';
import Dropdown from '../menus/Dropdown';
import InviteGroup from '@/components/particles/inputs/InviteGroup';
import LinkDisabledIcon from '../icons/LinkDisabled';
import LinkIcon from '../icons/Link';
import CircularLoader from '../../particles/loaders/Circular';

import { mapState, mapGetters } from 'vuex';

export default {
  name: 'share-project',
  components: {
    LinkDisabledIcon,
    Dropdown,
    InviteGroup,
    CircularLoader,
    LinkIcon
  },
  mixins: [
    ModalMixin
  ],
  data () {
    return {
      permission: null,
      processing: false,
      updating: false
    };
  },
  computed: {
    ...mapState('system', [
      'permissions',
      'roles'
    ]),
    ...mapGetters('entity', [
      'items',
      'invited',
      'link'
    ]),
    ...mapGetters('system', [
      'periods'
    ]),
    projects () {
      return this.items('project');
    },
    project () {
      return _.find(this.projects, item => item.id === this.params);
    },
    shared () {
      return this.link(this.params);
    },
    clientPermissions () {
      if (!this.project) {
        return _.first(this.permissions);
      }

      const permission = _.find(this.permissions, permission => permission.type === this.project.clientPermissions);
      return permission || _.first(this.permissions);
    }
  },
  methods: {
    initData () {

    },
    removeInvite (id) {
      const data = {
        entity: 'invite',
        id: id
      };

      this.$store.commit('entity/delete', data);
      this.$store.dispatch('entity/delete', data);
    },
    getParams (entity, params = {}) {
      return {
        entity: entity,
        params: params
      };
    },
    async fetchData () {
      this.processing = true;

      const invited = this.getParams('invite', {
        entityType: 'project',
        entityId: this.params
      });

      await this.$store.dispatch('entity/read', invited);
      this.processing = false;
    },
    copy () {
      this.$refs.link.value = `${document.location.origin}/project/${this.shared.id}/${this.shared.token}`;
      this.$refs.link.select();
      document.execCommand('copy');
    },
    async enable () {
      this.updating = true;

      const payload = {
        projectId: this.project.id,
        teamId: this.project.teamId,
        versionNumberShare: 0,
        expiry: null
      };

      await this.$store.dispatch('projectVersion/share', payload);
      this.updating = false;
    },
    async updatePermission (value) {
      this.updating = true;

      await this.$store.dispatch('entity/update', {
        entity: 'project',
        data: {
          clientPermissions: value.type
        },
        params: {
          id: this.params
        }
      });

      this.updating = false;
    },
    async updatePeriod (period) {
      this.updating = true;

      const payload = {
        params: {
          id: this.shared.id
        },
        data: {
          expiry: period.type
        }
      };

      await this.$store.dispatch('projectVersion/update', payload);
      this.updating = false;
    },
    async updateRole (role, id) {
      this.updating = true;

      this.$store.commit('entity/update', {
        entity: 'invite',
        data: {
          id: id,
          role: role.type
        }
      });

      await this.$store.dispatch('entity/update', {
        entity: 'invite',
        data: {
          role: role.type
        },
        params: {
          id: id
        }
      });

      this.updating = false;
    },
    async remove () {
      this.updating = true;

      await this.$store.dispatch('entity/delete', {
        entity: 'project-share',
        id: this.shared.id
      });

      this.updating = false;
    }
  },
  watch: {
    dialog () {
      if (this.dialog) {
        this.fetchData();
      }
    }
  }
};
</script>
