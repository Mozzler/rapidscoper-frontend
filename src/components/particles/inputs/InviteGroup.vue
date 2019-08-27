<template>
  <div>
    <circular-loader
      cls="loader-shadow--without-padding transparent"
      :size="50"
      :width="5"
      :visible="processing"
    />

    <v-layout row>
      <v-flex grow>
        <div :class="{'input-group': !isMobileDevice}">
          <v-text-field class="full-width"
                        name="email"
                        v-model="email"
                        v-validate="'required|email|min:6|max:255'"
                        placeholder="Enter email to invite user"
                        :error-messages="errors.first('email')"
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
import Dropdown from '../menus/Dropdown';
import CircularLoader from '../../particles/loaders/Circular';

export default {
  name: 'InviteGroup',
  components: {
    Dropdown,
    CircularLoader
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
    this.initData();
  },
  computed: {
    roles () {
      return this.$store.state.system.roles;
    }
  },
  methods: {
    getRequestData () {
      return {
        entity: 'invite',
        data: {
          entityId: this.entityId,
          entityType: this.entityType,
          expiry: null,
          role: this.role.type,
          email: this.email
        },
        cancelCommit: true
      };
    },
    async invite () {
      this.processing = true;
      let result = await this.$validator.validate();

      if (!result) {
        this.processing = false;
        return;
      }

      try {
        const data = this.getRequestData();
        await this.$store.dispatch('entity/create', data);
      } catch (error) {
        let msg = _.first(error.response.data);
        this.$root.$emit('show-error-message', msg.message);
      }

      this.processing = false;
      this.$emit('finish-processing');
      this.initData();
    },
    initData () {
      this.role = _.find(this.roles, (item, index) => index === 1);
      this.email = null;
    }
  }
};
</script>
