<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="416" persistent
              @keydown.enter.prevent.exact="() => submit(toStories)">
      <v-card class="modal-card">

        <circular-loader
          cls="loader-shadow--without-padding transparent"
          :size="50"
          :width="5"
          :visible="processing"
        />

        <div class="modal-header">
          <v-text-field
            ref="title"
            name="Project Name"
            v-validate="'required|min:2|max:100'"
            v-model="data.title"
            :error-messages="errors.first('Project Name')"
            :disabled="processing"
            placeholder="Project name..."
            solo
            class="input-without-border"
          ></v-text-field>
          <v-btn icon class="modal-close-btn" @click="closeModal">
            <v-icon>close</v-icon>
          </v-btn>
        </div>

        <v-card-text class="mt-3 padding-0">
          <v-layout row wrap>
            <v-flex xs6>
              <div>Team</div>
            </v-flex>
            <v-flex xs6 text-xs-right>
              <dropdown :list="teams"
                        :selected="data.team"
                        :disabled="processing"
                        @update="value => data.team = value" />
            </v-flex>
          </v-layout>
          <v-layout row wrap mt-3>
            <v-flex xs6>
              <div>Privacy</div>
            </v-flex>
            <v-flex xs6 text-xs-right>
              <dropdown :list="policies"
                        :disabled="processing"
                        :selected="data.policy"
                        @update="value => data.policy = value" />
            </v-flex>
          </v-layout>

          <v-flex shrink class="mt-40" :class="{
            'text-xs-right': !isMobileDevice,
            'text-xs-center': isMobileDevice }">
            <v-btn class="btn-rapid mr-3" large outline
                   :disabled="processing"
                   @click="closeModal">
              Cancel
            </v-btn>
            <v-btn class="btn-rapid primary" large
                   :disabled="processing"
                   @click="() => submit(toStories)">
              {{ isMobileDevice ? 'Create' : 'Create project' }}
            </v-btn>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import Dropdown from "../menus/Dropdown";
import CircularLoader from "../../particles/loaders/Circular";

import ModalMixin from '@/mixins/modal';

export default {
  name: 'create-project',
  components: {
    Dropdown,
    CircularLoader
  },
  mixins: [
    ModalMixin
  ],
  data () {
    return {
      policies: [
        'View', 'Edit'
      ],
      data: null
    };
  },
  computed: {
    teams () {
      return this.$store.getters['entity/items']('team');
    }
  },
  methods: {
    initData () {
      this.data = {
        team: this.teams[0],
        policy: this.policies[0],
        title: ''
      };
    },
    getPayload () {
      const anotherTeam = this.$route.params.name !== this.data.team.id;
      const commonSection = this.$route.params.name === 'all-projects';

      return {
        entity: 'project',
        action: 'entity/create',
        recreate: true,
        cancelCommit: (anotherTeam && !commonSection),
        data: {
          name: this.data.title,
          teamId: this.data.team.id
        }
      };
    },
    toStories () {

    }
  },
  watch: {
    dialog () {
      if (this.dialog) {
        this.$nextTick(() => {
          this.$refs.title.focus();
        });
      }
    }
  }
};
</script>
