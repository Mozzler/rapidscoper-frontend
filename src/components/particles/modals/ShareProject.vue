<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="608" persistent>
      <v-card class="modal-card">

        <circular-loader
          cls="loader-shadow--without-padding transparent"
          :size="50"
          :width="5"
          :visible="processing"
        />

        <div class="modal-header">
          <h1>Share</h1>
          <v-btn icon class="modal-close-btn" @click="closeModal">
            <v-icon>close</v-icon>
          </v-btn>
        </div>

        <v-card-text class="mt-3 padding-0">
          <v-flex align-self-center>
            <template v-if="!projectShare.length">
              <v-layout align-center justify-start row fill-height>
                <link-disabled-icon class="mr-3"/>
                <span class="cursor-default">Public link access is disabled.&nbsp;</span>
                <span class="text-reference" @click="enable">Enable access</span>
              </v-layout>
            </template>
            <template v-else>
              <div v-for="(item, index) in projectShare" :key="index">
                <v-layout align-center justify-space-between fill-height>
                  <div>
                    <link-icon class="mr-3"/>
                    <span class="text-reference" @click="() => copy(index)">Copy public link</span>
                  </div>
                  <div>
                    <v-layout row align-center justify-space-between fill-height>
                      <dropdown
                        :list="periods" class="mr-3"
                        :selected="period"
                        @update="value => updatePeriod(value, item.id)" />
                      <div @click="() => remove(item.id)">
                        <v-icon class="cursor-pointer">delete</v-icon>
                      </div>
                    </v-layout>
                  </div>
                </v-layout>
              </div>
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
                  :selected="permission"
                  @update="value => updatePermission(value)" />
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex grow mt-5>
            <invite-group
              v-if="dialog"
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
      link: null,
      period: null,
      permission: null,
      processing: false
    };
  },
  computed: {
    ...mapState('system', [
      'permissions',
      'periods',
      'roles'
    ]),
    ...mapGetters('entity', [
      'items',
      'invited'
    ]),
    projects () {
      return this.items('project');
    },
    project () {
      return _.find(this.projects, item => item.id === this.params);
    },
    projectShare () {
      const shared = this.items('projectShare');
      return _.filter(shared, item => item.projectId === this.params);
    }
  },
  beforeMount () {
    this.period = _.first(this.periods);
    this.permission = _.first(this.permissions);
  },
  methods: {
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
    fetchData () {
      this.processing = true;

      const requests = [];
      const data = [
        this.getParams('user-info', {
          projectId: this.params
        }),
        this.getParams('invite', {
          entityType: 'project',
          entityId: this.params
        })
      ];

      _.each(data, item => {
        this.$store.dispatch('entity/read', item);
        requests.push(this.$store.dispatch('entity/read', item));
      });

      Promise.all(requests)
        .then(() => {
          this.processing = false;
        });
    },
    initData () {
      this.link = null;
    },
    updatePermission (value) {
      this.permission = value;
      this.$store.dispatch('entity/update', {
        entity: 'project',
        data: {
          clientPermissions: value.type
        },
        params: {
          id: this.params
        }
      });
    },
    copy (index) {
      const shared = this.projectShare[index];
      this.$refs.link.value = `${document.location.origin}/project/${shared.id}/${shared.token}`;
      this.$refs.link.select();
      document.execCommand('copy');
    },
    enable () {
      this.processing = true;

      const payload = {
        projectId: this.project.id,
        teamId: this.project.teamId,
        versionNumberShare: 0,
        expiry: null
      };

      this.$store.dispatch('projectVersion/share', payload)
        .then(() => {
          this.processing = false;
        });
    },
    updatePeriod (period, id) {
      this.period = period;
      this.processing = true;

      let ms = period.replace(/\D/g, '');

      const payload = {
        params: {
          id: id
        },
        data: {
          expiry: ms ? ms * 86400000 : null
        }
      };

      this.$store.dispatch('projectVersion/update', payload)
        .then(() => {
          this.processing = false;
        });
    },
    updateRole (role, id) {
      this.$store.commit('entity/update', {
        entity: 'invite',
        data: {
          id: id,
          role: role.type
        }
      });

      this.$store.dispatch('entity/update', {
        entity: 'invite',
        data: {
          role: role.type
        },
        params: {
          id: id
        }
      });
    },
    remove (id) {
      this.processing = true;

      this.$store.dispatch('entity/delete', {
        entity: 'project-share',
        id: id
      }).then(() => {
        this.processing = false;
      });
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
