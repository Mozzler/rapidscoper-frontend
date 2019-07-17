<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="608">
      <v-card class="modal-card">

        <div class="modal-header">
          <h1> Invite user </h1>
          <v-btn icon class="modal-close-btn" @click="closeModal">
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
                <div class="select-in-input">
                  <dropdown :list="roles"
                            :selected="user.role"
                            @update="value => user.role = value" />
                </div>
              </div>
            </v-flex>

            <v-flex shrink pl-3 v-if="!isMobileDevice">
              <v-btn class="btn-rapid primary" large
                     @click="closeModal">
                Invite
              </v-btn>
            </v-flex>
          </v-layout>
          <v-flex shrink class="text-xs-right" v-if="isMobileDevice">
            <v-btn class="btn-rapid primary" large
                   @click="closeModal">
              Invite
            </v-btn>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import ModalMixin from '@/mixins/modal';
import Dropdown from "@/components/particles/menus/Dropdown";

export default {
  name: 'invite-user',
  components: { Dropdown },
  mixins: [
    ModalMixin
  ],
  data () {
    return {
      user: null,
      roles: [
        'Manager', 'Member', 'Client'
      ]
    };
  },
  methods: {
    initData () {
      this.user = {
        role: 'Member',
        entity: null
      };
    }
  }
};
</script>
