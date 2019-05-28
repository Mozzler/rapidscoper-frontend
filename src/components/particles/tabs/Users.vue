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
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                {{ props.item.role }}
                <v-btn icon v-on="on" class="dropdown-action">
                  <v-icon :ref="'arrow'">arrow_drop_down</v-icon>
                </v-btn>
              </template>
              <div class="dropdown-list">
                <v-list>
                  <v-list-tile
                    v-for="(role, key) in roles" :key="key" class="sidebar__item">
                    <v-list-tile-content>
                      <v-list-tile-title>
                        <v-layout align-center justify-space-between row fill-height>
                          <span>{{ role }}</span>
                        </v-layout>
                      </v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </div>
            </v-menu>
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
export default {
  name: 'Users',
  components: {AbsoluteMenu},
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
  mounted(){
    console.log(this.$refs.arrow);
  }
};
</script>

<style scoped>

</style>
