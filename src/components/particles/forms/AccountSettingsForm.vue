<template>
  <v-layout column>
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
      <v-text-field
        key="email"
        name="Email"
        v-validate="'required|email|min:6|max:255'"
        v-model="user.email"
        placeholder="Email"
        :error-messages="errors.first('Email')"
        :disabled="processing"
        solo
      ></v-text-field>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'AccountSettingsForm',
  props: {
    data: {
      type: Object,
      default: null
    },
    processing: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      user: this.data
    };
  },
  watch: {
    user: {
      deep: true,
      handler () {
        this.$emit('update', this.user);
      }
    }
  }
};
</script>
