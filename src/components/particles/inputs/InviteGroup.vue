<template>
  <div>
    <v-layout row>
      <v-flex grow>
        <div :class="{'input-group': !isMobileDevice}">
          <v-text-field class="full-width"
                        name="user"
                        v-model="user"
                        placeholder="Invite someone..."
                        solo
          ></v-text-field>
          <div class="select-in-input">
            <dropdown :list="roles"
                      :selected="role"
                      @update="value => role = value" />
          </div>
        </div>
      </v-flex>

      <v-flex shrink pl-3 v-if="!isMobileDevice">
        <v-btn class="btn-rapid primary" large
               @click="invite">
          Invite
        </v-btn>
      </v-flex>
    </v-layout>
    <v-flex shrink class="text-xs-right" v-if="isMobileDevice">
      <v-btn class="btn-rapid primary" large
             @click="invite">
        Invite
      </v-btn>
    </v-flex>
  </div>
</template>

<script>
import Dropdown from "../menus/Dropdown";

export default {
  name: "InviteGroup",
  components: {
    Dropdown
  },
  data () {
    return {
      user: null,
      role: null
    };
  },
  beforeMount () {
    this.role = _.first(this.roles);
  },
  computed: {
    roles () {
      return this.$store.state.system.roles;
    }
  },
  methods: {
    invite () {
      this.$emit('invite');
    }
  }
};
</script>
