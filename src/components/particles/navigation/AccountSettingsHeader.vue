<template>
  <div class="account-settings__header bottom-border">
    <v-layout align-center justify-space-between row fill-height>
      <h1>Account Settings</h1>
      <v-flex shrink>
        <v-btn class="btn-rapid primary mr-2" large
               :disabled="processing"
               @click="() => $emit('save')">
          Save
        </v-btn>
        <v-btn class="btn-rapid" large outline
               :disabled="processing"
               @click="() => $emit('cancel')">
          Close
        </v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: 'AccountSettingsHeader',
  props: {
    processing: {
      type: Boolean,
      default: false
    }
  }
};
</script>
