<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="416">
      <v-card class="modal-card">

        <div class="modal-header">
          <v-text-field
            name="Team Title"
            v-validate="'required|min:2|max:100'"
            v-model="data.title"
            :error-messages="errors.first('Team Title')"
            :disabled="processing"
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
                   @click="submit">
              {{ isMobileDevice ? 'Create' : 'Create project' }}
            </v-btn>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import ModalMixin from '@/mixins/modal';
import Dropdown from "../menus/Dropdown";

export default {
  name: 'create-project',
  components: {
    Dropdown
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
      return this.$store.getters['entity/items']('teams');
    }
  },
  methods: {
    initData () {
      this.data = {
        team: this.teams[0],
        policy: this.policies[0],
        title: 'Untitled'
      };
    },
    getPayload () {
      return {
        entity: 'project',
        action: 'entity/create',
        recreate: true,
        data: {
          name: this.data.title,
          teamId: this.data.team.id
        }
      };
    }
  }
};
</script>
