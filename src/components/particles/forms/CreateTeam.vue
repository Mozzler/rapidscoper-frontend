<template>
  <v-container pa-0 class="signup-container">
    <h1 class="sign-up-header--m43">Create a Team</h1>
    <v-form>
      <v-layout row wrap>
        <v-flex xs12 class="signup-input">
          <v-text-field
            name="team"
            v-validate="'required|min:6|max:255'"
            v-model="team"
            placeholder="Team name"
            :error-messages="errors.first('team')"
            :disabled="processing"
            solo
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-btn class="btn-rapid primary submit-btn mt-5px" block large @click="create">
            Create
          </v-btn>
        </v-flex>
        <v-flex xs12>
          <p class="forgot-link">
            <router-link to="/">
              Skip
            </router-link>
          </p>
        </v-flex>
      </v-layout>
    </v-form>
  </v-container>
</template>

<script>

export default {
  name: 'CreateTeam',
  data: () => ({
    team: null,
    processing: false
  }),
  methods: {
    async create () {
      this.processing = true;

      let result = await this.$validator.validate();

      if (result) {
        this.processing = true;
        /* this.$store.dispatch(this.action, this.user)
            .then(() => {
            }); */
      } else {
        this.processing = false;
      }
    },
  }
};
</script>
