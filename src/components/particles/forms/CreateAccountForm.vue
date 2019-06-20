<template>
  <v-container pa-0 class="signup-container">
    <h1 class="sign-up-header--m43">Create an Account</h1>
    <v-form>
      <v-layout row wrap>
        <v-flex xs12 class="signup-input">
          <div>
            <div class="signup-loader sign-up-header--m43" @click="$refs.inputUpload.click()">
              <photo-camera />
            </div>
            <input v-show="false" ref="inputUpload" type="file" />
          </div>
        </v-flex>
        <v-flex xs12 class="signup-input">
          <v-text-field
            key="first name"
            name="First name"
            v-validate="'required|min:2|max:100'"
            v-model="user.firstName"
            placeholder="First name"
            :error-messages="errors.first('First name')"
            :disabled="processing"
            solo
          ></v-text-field>
        </v-flex>
        <v-flex xs12 class="signup-input">
          <v-text-field
            key="last name"
            name="Last name"
            v-validate="'required|min:2|max:100'"
            v-model="user.lastName"
            placeholder="Last name"
            :error-messages="errors.first('Last name')"
            :disabled="processing"
            solo
          ></v-text-field>
        </v-flex>
        <v-flex xs12 class="signup-input">
          <vue-tel-input
            :enabledCountryCode="true"
            :disabledFetchingCountry="true"
            wrapperClasses="phone-input"
            v-model="user.phone"
            placeholder="Phone number"
            :disabled="processing"/>
        </v-flex>
        <v-flex xs12 class="signup-input">
          <v-text-field
            key="team name"
            name="Team name"
            v-validate="'required|min:2|max:100'"
            v-model="team"
            placeholder="Team name"
            :error-messages="errors.first('Team name')"
            :disabled="processing"
            solo
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-btn class="btn-rapid primary submit-btn mt-5px" block large @click="create">
            Create
          </v-btn>
        </v-flex>
      </v-layout>
    </v-form>
  </v-container>
</template>

<script>
import PhotoCamera from '../../particles/icons/PhotoCamera';

export default {
  name: 'CreateAccountForm',
  components: {
    PhotoCamera
  },
  data: () => ({
    user: {
      firstName: null,
      lastName: null,
      phone: null
    },
    team: null,
    processing: false
  }),
  methods: {
    send () {
      return Promise.all([
        this.$store.dispatch('updateUserInfo', this.user),
        this.$store.dispatch('createTeam', this.team)
      ]);
    },
    async create () {
      this.processing = true;

      let result = await this.$validator.validate();

      if (result) {
        this.processing = true;

        this.send().then(() => {
            this.processing = false;
            //this.$router.push('/');
          }).catch(error => {
            this.processing = false;
            console.log(errors);
          });
      } else {
        this.processing = false;
      }
    }
  }
};
</script>
