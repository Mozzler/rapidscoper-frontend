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
            <template v-if="!shared.length">
              <link-disabled-icon class="mr-4"/>
              <span>Public link access is disabled. </span>
              <span class="text-reference" @click="enable">Enable access</span>
            </template>
            <template v-else>
              <div v-for="(item, index) in shared" :key="index">
                <link-icon class="mr-4"/>
                <span class="text-reference" @click="() => copy(index)">Copy public link</span>
                <input :value="item" class="input--hidden" :ref="`link-input-${index}`"/>
              </div>
            </template>
          </v-flex>
          <v-divider
            class="my-3" />
          <v-flex>
            <div class="text-sm-center text-greyed">There are no invited users yet</div>
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
            <invite-group />
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
      shared: [],
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
      this.$refs[`link-input-${index}`][0].select();
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
        .then(response => {
          const item = response.item;
          const path = `${document.location.origin}/project/${item.id}/${item.token}`;
          this.shared.push(path);

          this.processing = false;
        });
    }
  }
};
</script>
