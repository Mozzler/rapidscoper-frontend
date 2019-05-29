<template>
  <v-data-table
    :headers="headers"
    :items="items"
    item-key="name"
    :hide-actions="true"
    class="dashboard-table">

    <template v-slot:items="props">
      <tr @click="props.expanded = !props.expanded">
        <td>
          <v-layout align-center justify-start row fill-height>
            <img src="@/assets/img/user.png" />
            <span> {{ props.item.username }} </span>
          </v-layout>
        </td>
        <td>{{ props.item.email }}</td>
        <td>
          <v-flex>
            <dropdown :list="roles" :selected="props.item.role"
              @update="value => props.item.role = value" />
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
        'Manager', 'Full Member', 'Client'
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
      ],
      items: [
        {
          username: 'Jennifer Foster',
          email: 'jenniferfoster@gmail.com',
          role: 'Full Member'
        },
        {
          username: 'Jennifer Foster',
          email: 'jenniferfoster@gmail.com',
          role: 'Full Member'
        }
      ],
    };
  },
};
</script>

<style scoped>

</style>
