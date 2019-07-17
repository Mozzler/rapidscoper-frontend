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
            <dropdown :list="roles" :selected="props.item.role"
                      @update="value => updateRole(value, props.item.id)" />
          </v-flex>
        </td>
        <td class="text-xs-left">
          <v-icon>delete</v-icon>
        </td>
      </tr>
      <span class="tr-border" />
    </template>
  </v-data-table>
</template>

<script>
import AbsoluteMenu from "../menus/AbsoluteMenu";
import Dropdown from "../menus/Dropdown";
export default {
  name: 'Users',
  components: {Dropdown, AbsoluteMenu},
  data () {
    return {
      roles: [
        'Manager', 'Member', 'Client'
      ],
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
      ]
    };
  },
  methods: {
    fetchData () {
      const filter = {
        $or: [
          { 'fullDocument.teamId': {$in: [this.$route.params.name] } }
        ],
        params: [
          {
            $lookup: {
              from: 'userInfo',
              localField: 'userId',
              foreignField: 'userId',
              as: 'userData'
            }
          },
          { $unwind: '$userData' }
        ]
      };

      this.$store.commit('entity/resetList', 'userTeam');
      this.connect('userTeam', 'entity/setList', filter);
    },
    updateRole (role, id) {
      this.$store.dispatch('entity/update', {
        entity: 'user-team',
        params: {
          id: id
        },
        data: {
          role: role.toLowerCase().replace(/ /g, '-')
        }
      });
    }
  },
  beforeMount () {
    this.fetchData();
  },
  beforeDestroy () {
    this.$store.commit('entity/resetList', 'userTeam');
  },
  computed: {
    userTeam () {
      return this.$store.getters['entity/items']('userTeam');
    }
  }
};
</script>
