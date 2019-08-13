<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="608" persistent>
      <v-card class="modal-card">
        <div class="modal-header">
          <h1> Invite user </h1>
          <v-btn icon class="modal-close-btn" @click="closeModal">
            <v-icon>close</v-icon>
          </v-btn>
        </div>

        <v-card-text class="invite-user-card padding-0">
          <invite-group v-if="dialog"
            @finish-processing="closeModal"
            :entityId="$route.params.name"
            :entityType="`team`"/>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import ModalMixin from '@/mixins/modal';
import Dropdown from "@/components/particles/menus/Dropdown";
import InviteGroup from "../inputs/InviteGroup";

export default {
  name: 'invite-user',
  components: {
    InviteGroup,
    Dropdown,
  },
  mixins: [
    ModalMixin
  ],
  methods: {
    initData () {}
  }
};
</script>
