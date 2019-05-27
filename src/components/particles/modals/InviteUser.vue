<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="608">
      <v-card class="modal-card">

        <div class="modal-header">
          <h1> Invite user </h1>
          <v-btn icon class="modal-close-btn" @click="() => $emit('close-modal')">
            <v-icon>close</v-icon>
          </v-btn>
        </div>

        <v-card-text class="invite-user-card padding-0">
          <v-layout row>
            <v-flex grow>
              <div :class="{'input-group': !isMobileDevice}">
                <v-text-field class="full-width"
                  name="user"
                  v-model="user.entity"
                  placeholder="Invite someone..."
                  solo
                ></v-text-field>
                <v-autocomplete
                  ref="select"
                  v-model="user.role"
                  :items="roles"
                  placeholder="Select..."
                  required
                  class="rapid-select select-in-input"
                ></v-autocomplete>
              </div>
            </v-flex>

            <v-flex shrink pl-3 :class="{
              'text-xs-right': !isMobileDevice,
              'text-xs-center': isMobileDevice }">
              <v-btn class="btn-rapid primary" large
                     @click="() => $emit('close-modal')">
                Invite
              </v-btn>
            </v-flex>
          </v-layout>
          <v-flex shrink class="text-xs-right" v-if="isMobileDevice">
            <v-btn class="btn-rapid primary" large
                   @click="() => $emit('close-modal')">
              Invite
            </v-btn>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  name: 'InviteUser',
  props: [
    'show'
  ],
 data() {
    return {
      dialog: false,
      user: null,
      roles: [
        'Manager', 'Full Member', 'Client'
      ],
    }
 },
  beforeMount() {
    this.dialog = this.show;
    this.user = {
      role: 'Full Member',
      entity: null
    }
  },
  watch: {
    show() {
      this.dialog = this.show;
    }
  },
  computed: {
    isMobileDevice() {
      return this.$store.state.auth.isMobileDevice;
    }
  }

};
</script>

<style scoped>

</style>
