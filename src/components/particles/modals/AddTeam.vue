<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="416">
      <v-card class="modal-card">

        <div class="modal-header">
          <h1> Create new team </h1>
          <v-btn icon class="modal-close-btn" @click="closeModal">
            <v-icon>close</v-icon>
          </v-btn>
        </div>

        <v-card-text class="mt-3 padding-0">
          <v-layout row wrap>
            <v-flex xs12>
              Name your team.
            </v-flex>
            <v-flex xs12 mt-4>
              <v-text-field
                key="team name"
                name="Team name"
                placeholder="Team name"
                v-model="data.name"
                v-validate="'required|min:2|max:100'"
                :error-messages="errors.first('Team name')"
                solo
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-flex shrink mt-4 :class="{
            'text-xs-right': !isMobileDevice,
            'text-xs-center': isMobileDevice }">
            <v-btn class="btn-rapid mr-3" large outline
                   @click="closeModal">
              Cancel
            </v-btn>
            <v-btn class="btn-rapid primary" large
                   @click="submit">
              {{ isMobileDevice ? 'Create' : 'Create team' }}
            </v-btn>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import ModalMixin from '@/mixins/modal';

export default {
  name: "add-team",
  mixins: [
    ModalMixin
  ],
  data () {
    return {
      data: {
        name: null
      },
      processing: false
    }
  },
  methods: {
    async submit () {
      this.processing = true;

      const result = await this.$validator.validate();

      if (result) {
        this.$store.dispatch('createTeam', this.data)
          .then(data => {
            this.processing = false;
            this.closeModal();
            console.log(data);
          })
          .catch(error => {
            this.processing = false;
            console.log(error);
          });
      } else {
        this.processing = false;
      }
    }
  }
};
</script>
