<template>
  <v-data-table
    :headers="headers"
    :items="userTeam"
    item-key="name"
    :hide-actions="true"
    :loading="initialization"
    class="dashboard-table">

    <template v-slot:items="props">
      <tr @click="props.expanded = !props.expanded"
        :class="{'bg--light-primary': props.item.entity === 'invite'}">
        <td>
          <v-layout align-center justify-start row fill-height>
            <v-flex shrink mr-3>
              <img :src="props.item.avatarUrl" />
            </v-flex>
            <v-flex grow>
              {{ props.item.name }}
            </v-flex>
          </v-layout>
        </td>
        <td>{{ props.item.email }}</td>
        <td>
          <v-flex>
            <div class="position-relative white-space-nowrap">
              <dropdown
                :list="roles"
                :selectBtn="hasPermission(props.item.role)"
                :selected="props.item.role"
                @update="value => updateRole(value, props.item.id, props.item.entity)" />
            </div>
          </v-flex>
        </td>
        <td class="text-xs-left">
          <v-btn icon :disabled="userRoleType !== 'manager'"
                 @click="() => deleteMember(props.item.id, props.item.entity)">
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

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

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
        'userInfo', 'userTeam', 'invite'
      ]
    };
  },
  methods: {
    ...mapMutations('entity', {
      'updateM': 'update',
      'deleteM': 'delete'
    }),
    ...mapActions('entity', {
      'updateA': 'update',
      'deleteA': 'delete'
    }),
    hasPermission (role) {
      return !!_.find(this.roles, item => item.type === role.type);
    },
    updateRole (role, id, entity) {
      const data = {
        entity: entity,
        cancelCommit: true,
        params: {
          id: id
        },
        data: {
          id: id,
          role: role.type
        }
      };

      this.updateM(data);
      this.updateA(data);
    },
    deleteMember (id, entity) {
      this.deleteM({ id, entity });
      this.deleteA({ id, entity });
    }
  },
  computed: {
    ...mapState('auth', [
      'user'
    ]),
    ...mapGetters({
      allowedRoles: 'entity/allowedRoles',
      invited: 'entity/invited'
    }),
    teamId () {
      return this.$route.params.name;
    },
    userTeam () {
      return this.invited(this.teamId);
    },
    roles () {
      return this.allowedRoles(this.teamId, 'team');
    },
    userRoleType () {
      const found = _.find(this.userTeam, item => item.userId === this.user.user_id);
      return found && found.role ? found.role.type : null;
    },
    permission () {
      return !!_.find(this.roles, item => item.type === this.userRoleType);
    }
  }
};
</script>
