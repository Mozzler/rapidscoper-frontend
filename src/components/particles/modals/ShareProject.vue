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
                <span>Public link access is disabled.&nbsp;</span>
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
                      <dropdown :list="periods" class="mr-3"
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
            <div class="text-sm-center text-greyed">
              There are no invited users yet
            </div>
          </v-flex>
          <v-divider
            class="my-3" />
          <v-flex>
            <v-layout align-center justify-space-between>
              <v-flex grow>
                <span>Client's permission</span>
              </v-flex>
              <v-flex shrink>
                <dropdown
                  :list="permissions"
                  :selected="permission"
                  @update="value => handleDropdown(value)" />
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex grow mt-5>
            <invite-group v-if="dialog"
                          :entityId="$route.params.projectId"
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
import LinkDisabledIcon from "../icons/LinkDisabled";
import LinkIcon from "../icons/Link";
import CircularLoader from "../../particles/loaders/Circular";

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
    projectId () {
      return this.$route.params.projectId;
    },
    projects () {
      return this.$store.getters['entity/items']('project');
    },
    project () {
      return _.find(this.projects, item => item.id === this.projectId);
    },

    periods () {
      return this.$store.state.system.periods;
    },
    permissions () {
      return this.$store.state.system.permissions;
    },
    projectShare () {
      return this.$store.getters['entity/items']('projectShare');
    }
  },
  beforeMount () {
    this.period = _.first(this.periods);
    this.permission = _.first(this.permissions);
  },
  methods: {
    initData () {
      this.link = null;
    },
    handleDropdown () {

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
    remove (id) {
      this.processing = true;

      this.$store.dispatch('entity/delete', {
        entity: 'project-share',
        id: id
      }).then(() => {
        this.processing = false;
      });
    }
  }
};
</script>
