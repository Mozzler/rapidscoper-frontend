<template>
  <div class="app">
    <div class="app__img" />
    <v-layout align-center>
      <v-flex xs12 sm4 text-xs-center>
        <div>
          <v-btn depressed large class="primary">Primary</v-btn>
        </div>
        <div>
          <v-btn depressed large disabled>Primary</v-btn>
        </div>
        <div>
          <v-btn depressed class="primary">Primary</v-btn>
        </div>
        <div>
          <v-btn depressed outline>Primary 1</v-btn>
        </div>
        <div>
          <v-btn depressed outline large>Primary</v-btn>
        </div>
      </v-flex>
      <logo-git-hub/>
      <v-form ref="form" lazy-validation v-model="valid">
        <div>
          <label class="label">Label</label>
          <v-text-field
            v-model="name"
            :rules="nameRules"
            required
            placeholder="Placeholder"
            solo
          ></v-text-field>
        </div>
        <v-btn @click="validate">submit</v-btn>
        <v-btn>clear</v-btn>
      </v-form>
    </v-layout>
  </div>
</template>

<script>
import LogoGitHub from '../particles/icons/LogoGitHub';

export default {
  name: 'Home',
  components: {
    LogoGitHub
  },
  data: () => ({
    valid: true,
    name: '',
    nameRules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 10) || 'Name must be less than 10 characters'
    ]
  }),
  methods: {
    validate () {
      this.$refs.form.validate();
    }
  }
};
</script>
