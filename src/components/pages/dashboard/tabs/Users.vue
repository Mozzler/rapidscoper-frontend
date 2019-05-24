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
          <v-autocomplete
            ref="role"
            v-model="props.item.role"
            :items="roles"
            placeholder="Select role ..."
            class="rapid-select"
          ></v-autocomplete>
        </td>
        <td class="text-xs-left">
          <v-icon>delete</v-icon>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
    export default {
      name: "Users",
      data() {
        return {
          roles: [
            'Full Member'
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
              value: 'email',
            },
            {
              text: 'role',
              sortable: false,
              value: 'role',
            },
            {
              text: 'actions',
              sortable: false,
              value: 'actions',
            },
          ],
          items: [
            {
              username: 'Jennifer Foster',
              email: 'jenniferfoster@gmail.com',
              role: 'Full Member',
            },
            {
              username: 'Jennifer Foster',
              email: 'jenniferfoster@gmail.com',
              role: 'Full Member',
            },
          ]
        }
      },
    }
</script>

<style scoped>

</style>
