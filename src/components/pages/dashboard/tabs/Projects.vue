<template>
  <div class="table-container">
    <v-autocomplete
      ref="country"
      v-model="active"
      :items="dropdown"
      placeholder="Select..."
      required
      class="rapid-select select-bold"
    ></v-autocomplete>

    <v-data-table
      :headers="headers"
      :items="items"
      item-key="name"
      :hide-actions="true"
      class="dashboard-table projects-table">

      <template v-slot:items="props">
        <tr @click="props.expanded = !props.expanded">
          <td>
            {{ props.item.name }}
            <span class="index" v-if="props.item.index">
              {{ props.item.index }}
            </span>
          </td>
          <td>
            <v-layout align-center justify-start row fill-height>
              <img src="@/assets/img/user.png" v-for="i in 3" />
            </v-layout>
          </td>
          <td>{{ props.item.last_changes }}</td>
          <td>
            <v-layout align-center justify-space-between row fill-height>
              <v-icon>share</v-icon>
              <v-icon>archive</v-icon>
            </v-layout>
          </td>
        </tr>
        <span class="tr-border" />
      </template>
    </v-data-table>
  </div>
</template>

<script>
    export default {
      name: "Projects",
      data() {
        return {
          active: 'Active',
          dropdown: ['Active'],
          headers: [
            {
              text: 'project',
              sortable: false,
              value: 'name'
            },
            {
              text: 'members',
              sortable: false,
              value: 'members',
            },
            {
              text: 'last changes',
              sortable: false,
              value: 'last changes',
            },
            {
              text: 'actions',
              sortable: false,
              value: 'actions',
            },
          ],
          items: [
            {
              name: 'Skellorbit',
              index: 4,
              last_changes: 'a day ago',
            },
            {
              name: 'Skellorbit',
              index: 4,
              last_changes: '2 days ago',
            },
            {
              name: 'Skellorbit',
              index: null,
              last_changes: 'a day ago',
            },
          ]
        }
      },
    }
</script>

<style scoped>

</style>
