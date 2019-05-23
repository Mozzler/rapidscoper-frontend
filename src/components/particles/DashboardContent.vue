<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-layout xs12 sm12 md12>
        <v-container pa-0>
          <v-layout align-center justify-space-between row fill-height>
            <h1>All projects</h1>
            <v-btn large class="btn-rapid primary large">
              Create new project
            </v-btn>
          </v-layout>
          <v-data-table
              :headers="headers"
              :items="items"
              :expand="expand"
              item-key="name"
              :hide-actions="true"
              class="projects-table">

            <template v-slot:items="props">
              <tr @click="props.expanded = !props.expanded">
                <td>
                  {{ props.item.name }}
                  <span class="index" v-if="props.item.index">
                    {{ props.item.index }}
                  </span>
                </td>
                <td>
                  <span v-for="i in 3">
                    <img src="@/assets/img/user.png" />
                  </span>
                </td>
                <td>{{ props.item.last_changes }}</td>
                <td class="text-xs-right">
                  <v-icon>share</v-icon>
                  <v-icon class="ml-3">archive</v-icon>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-container>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
    export default {
        name: "DashboardContent",
      data() {
          return {
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
                align: 'right',
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
                index: 4,
                last_changes: 'a day ago',
              },
            ]
          }
      }
    }
</script>
