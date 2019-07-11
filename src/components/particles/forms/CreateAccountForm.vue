<template>
  <v-container pa-0 class="signup-container">
    <h1 class="sign-up-header--m43">Create an Account</h1>
    <v-form @keyup.native.enter="create">
      <v-layout row wrap>
        <v-flex xs12 class="signup-input">
          <div>
            <div class="signup-loader sign-up-header--m43"
                 @click="$refs.inputUpload.click()">
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
            @input="formatPhone"
            :disabledFormatting="true"
            :enabledCountryCode="true"
            :disabledFetchingCountry="true"
            wrapperClasses="phone-input"
            v-model="user.phone"
            v-validate="'required|min:10|max:30'"
            name="phone"
            placeholder="Phone number"
            :disabled="processing"/>
          <error-message :msg="errors.first('phone')" />
        </v-flex>
        <v-flex xs12 class="signup-input">
          <v-text-field
            key="team name"
            name="Team name"
            v-validate="'required|min:2|max:100'"
            v-model="team.name"
            placeholder="Team name"
            :error-messages="errors.first('Team name')"
            :disabled="processing"
            solo
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-btn class="btn-rapid primary submit-btn mt-5px" block large
                 :disabled="processing"
                 @click="create">
            Create
          </v-btn>
        </v-flex>
      </v-layout>
    </v-form>
  </v-container>
</template>

<script>
import PhotoCamera from '../../particles/icons/PhotoCamera';
import ErrorMessage from '../../particles/alerts/error-message';

export default {
  name: 'CreateAccountForm',
  components: {
    PhotoCamera,
    ErrorMessage
  },
  data: () => ({
    user: {
      firstName: null,
      lastName: null,
      phone: null
    },
    team: {
      name: null
    },
    processing: false
  }),
  computed: {
    authorized () {
      return this.$store.state.auth.user;
    }
  },
  created () {
    this.connect('user', [], 'auth/update');
  },
  methods: {
    send () {
      const payload = {
        data: this.team,
        entity: 'team'
      };

      return Promise.all([
        this.$store.dispatch('auth/update', this.user),
        this.$store.dispatch('entity/create', payload)
      ]);
    },
    formatPhone (data) {
      let formatted = data.replace(/ |[^0-9]/g, '');
      this.$nextTick(() => {
        this.user.phone = formatted.replace(/(.{4})/g, '$1 ');

        if (data.length < this.user.phone.length) {
          this.user.phone =  this.user.phone.slice(0, -1);
        }
      });
    },
    async create () {
      this.processing = true;

      let result = await this.$validator.validate();

      if (result) {
        this.processing = true;

        this.send().then(() => {
          this.$router.push('/dashboard/all-projects');
          this.processing = false;
        }).catch(error => {
          this.handleErrors(error);
          this.processing = false;
        });
      } else {
        this.processing = false;
      }
    }
  }
};
</script>
