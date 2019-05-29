<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="416">
      <v-card class="modal-card">

        <div class="modal-header">
          <h1> <input v-model="data.title" /> </h1>
          <v-btn icon class="modal-close-btn" @click="closeModal">
            <v-icon>close</v-icon>
          </v-btn>
        </div>

        <v-card-text class="mt-4 padding-0">
          <v-layout row wrap>
            <v-flex xs6>
              <div>Team</div>
            </v-flex>
            <v-flex xs6 text-xs-right>
              <dropdown :list="teams" :selected="data.team"
                        @update="value => data.team = value" />
            </v-flex>
          </v-layout>
          <v-layout row wrap mt-3>
            <v-flex xs6>
              <div>Privacy</div>
            </v-flex>
            <v-flex xs6 text-xs-right>
              <dropdown :list="policies" :selected="data.policy"
                        @update="value => data.policy = value" />
            </v-flex>
          </v-layout>

          <v-flex shrink class="mt-40" :class="{
            'text-xs-right': !isMobileDevice,
            'text-xs-center': isMobileDevice }">
            <v-btn class="btn-rapid mr-3" large outline
                   @click="closeModal">
              Cancel
            </v-btn>
            <v-btn class="btn-rapid primary" large
                   @click="closeModal">
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
      ModalMixin,
    ],
    data() {
      return {
        teams: [
          'The Bumpy Hamsters', 'West World', 'The Ramblers'
        ],
        policies: [
          'View', 'Edit'
        ],
        data: null,
      }
    },
    beforeMount() {
      this.data = {
        team: this.teams[0],
        policy: this.policies[0],
        title: 'Untitled'
      }
    },
  };
</script>
