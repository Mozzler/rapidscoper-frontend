<template>
  <v-data-table
    :headers="headers"
    :items="userTeam"
    item-key="name"
    :hide-actions="true"
    :loading="initialization"
    class="dashboard-table">

    <template v-slot:items="props">
      <tr @click="props.expanded = !props.expanded">
        <td>
          <v-layout align-center justify-start row fill-height>
            <v-flex shrink mr-3>
              <img :src="props.item.userData.avatarUrl" />
            </v-flex>
            <v-flex grow>
              {{ props.item.userData.firstName }} {{ props.item.userData.lastName }}
            </v-flex>
          </v-layout>
        </td>
        <td>{{ props.item.userData.email }}</td>
        <td>
          <v-flex>
            <div class="position-relative white-space-nowrap">
              <dropdown
                :list="roles"
                :selectBtn="hasPermission(props.item.role)"
                :selected="props.item.role"
                @update="value => updateRole(value, props.item.id)" />
            </div>
          </v-flex>
        </td>
        <td class="text-xs-left">
          <v-btn icon :disabled="role.type !== 'manager'">
            <v-icon>delete</v-icon>
          </v-btn>
        </td>
      </tr>
      <span class="tr-border" />
    </template>
  </v-data-table>
</template>

<script>
import Dropdown from '../menus/Dropdown';
import ConnectIndicatorMixin from '@/mixins/connect-indicator';

import { mapState, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'Users',
  components: {
    Dropdown
  },
  mixins: [
    ConnectIndicatorMixin
  ],
  data () {
    return {
      processing: true,
      headers: [
        {
          text: 'user',
          sortable: false,
          value: 'user'
        },
        {
          text: 'email',
          sortable: false,
          value: 'email'
        },
        {
          text: 'role',
          sortable: false,
          value: 'role'
        },
        {
          text: 'actions',
          sortable: false,
          value: 'actions'
        }
      ],
      collections: [
        'userInfo', 'userProject', 'project'
      ]
    };
  },
  methods: {
    ...mapMutations('entity', [
      'resetList',
      'setList',
      'update'
    ]),
    hasPermission (role) {
      return !!_.find(this.roles, item => item.type === role.type);
    },
    updateRole (role, id) {
      const data = {
        entity: 'user-team',
        cancelCommit: true,
        params: {
          id: id
        },
        data: {
          id: id,
          role: role.type
        }
      };
      this.update(data);
      this.$store.dispatch('entity/update', data);
    }
  },
  beforeMount () {
    this.fetchData();
  },
  beforeDestroy () {
    this.resetList('userTeam');
  },
  computed: {
    ...mapState('auth', [
      'user'
    ]),
    ...mapGetters({
      allowedRoles: 'entity/allowedRoles',
      items: 'entity/items'
    }),
    roles () {
      return this.allowedRoles(this.teamId, 'team');
    },
    role () {
      return _.find(this.userTeam, item => item.userId === this.user.user_id &&
        item.teamId === this.teamId).role;
    },
    teamId () {
      return this.$route.params.name;
    },
    permission () {
      const role = _.find(this.userTeam, item => item.userId === this.user.user_id &&
        item.teamId === this.teamId).role;
      return !!_.find(this.roles, item => item.type === role.type);
    },
    userTeam () {
      return this.items('userTeam');
    }
  }
};
</script>
