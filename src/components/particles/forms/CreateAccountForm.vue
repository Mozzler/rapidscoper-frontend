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
            <input v-show="false" ref="inputUpload" type="file" @change="loaded" />
          </div>
        </v-flex>
        <v-flex xs12 class="signup-input">
          <v-text-field
            key="first name"
            name="First name"
            v-validate="'required|min:6|max:255'"
            v-model="user.firstname"
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
            v-validate="'required|min:6|max:255'"
            v-model="user.lastname"
            placeholder="Last name"
            :error-messages="errors.first('Last name')"
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

import * as actionConst from '../../../store/actions/auth';
import PhotoCamera from '../../particles/icons/PhotoCamera';

export default {
  name: 'CreateAccountForm',
  components: {
    PhotoCamera
  },
  data: () => ({
    user: {
      email: null,
      password: null
    },
    processing: false
  }),
  methods: {
    async create () {
      this.processing = true;

      let result = await this.$validator.validate();

      if (result) {
        this.processing = true;
        this.$store.dispatch(this.action, this.user)
            .then(() => {
            });
        this.$router.push('/');
      } else {
        this.processing = false;
      }
    },
    loaded() {
      console.log('loaded');
    }
  }
};
</script>
