<template>
  <div>
    <v-layout row>
      <v-flex grow>
        <div :class="{'input-group': !isMobileDevice}">
          <v-text-field class="full-width"
                        name="email"
                        v-model="email"
                        v-validate="'required|email|min:6|max:255'"
                        :disabled="processing"
                        placeholder="Enter email to invite user"
                        solo
          ></v-text-field>
          <div class="select-in-input">
            <dropdown :list="roles"
                      :disabled="processing"
                      :selected="role"
                      @update="value => role = value" />
          </div>
        </div>
      </v-flex>

      <v-flex shrink pl-3 v-if="!isMobileDevice">
        <v-btn class="btn-rapid primary" large
               :disabled="processing"
               @click="invite">
          Invite
        </v-btn>
      </v-flex>
    </v-layout>
    <v-flex shrink class="text-xs-right" v-if="isMobileDevice">
      <v-btn class="btn-rapid primary" large
             :disabled="processing"
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
  props: {
    entityId: {
      required: true,
      default: null
    },
    entityType: {
      required: true,
      default: null
    }
  },
  data () {
    return {
      email: null,
      role: null,
      processing: false
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
    async invite () {
      this.processing = true;
      let result = await this.$validator.validate();

      if (!result) {
        this.processing = false;
        return;
      }

      await this.$store.dispatch('entity/create', {
        entity: 'invite',
        data: {
          entityId: this.entityId,
          entityType: this.entityType,
          expiry: null,
          role: this.role.toLowerCase(),
          email: this.email
        }
      });

      this.processing = false;
    }
  }
};
</script>
