<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="416">
      <v-card class="modal-card">

        <div class="modal-header">
          <h1> <input v-model="data.title" /> </h1>
          <v-btn icon class="modal-close-btn" @click="() => $emit('close-modal')">
            <v-icon>close</v-icon>
          </v-btn>
        </div>

        <v-card-text class="mt-4 padding-0">
          <v-layout row wrap>
            <v-flex xs6>
              <div>Team</div>
            </v-flex>
            <v-flex xs6>
              <v-autocomplete
                ref="select"
                v-model="data.team"
                :items="teams"
                placeholder="Select..."
                required
                class="rapid-select align-right"
              ></v-autocomplete>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs6>
              <div>Privacy</div>
            </v-flex>
            <v-flex xs6>
              <v-autocomplete
                ref="select"
                v-model="data.policy"
                :items="policies"
                placeholder="Select..."
                required
                class="rapid-select align-right"
              ></v-autocomplete>
            </v-flex>
          </v-layout>

          <v-flex shrink mt-4 :class="{
            'text-xs-right': !isMobileDevice,
            'text-xs-center': isMobileDevice }">
            <v-btn class="btn-rapid mr-3" large outline
                   @click="() => $emit('close-modal')">
              Cancel
            </v-btn>
            <v-btn class="btn-rapid primary" large
                   @click="() => $emit('close-modal')">
              {{ isMobileDevice ? 'Create' : 'Create project' }}
            </v-btn>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import Modal from '@/mixins/modal';

  export default {
    name: 'CreateProject',
    mixins: [
      Modal
    ],
    data() {
      return {
        teams: [
          'The Bumpy Hamsters', 'West World', 'The Ramblers'
        ],
        policies: [
          'Private', 'Public'
        ],
        data: null
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
