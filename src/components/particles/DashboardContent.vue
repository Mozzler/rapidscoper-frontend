<template>
  <v-container>
    <v-layout align-center justify-space-between row fill-height>
      <h1>All projects</h1>
      <dashboard-action-btn :text="'Create new project'"/>
    </v-layout>
    <v-data-table
        :headers="headers"
        :items="items"
        item-key="name"
        :hide-actions="true"
        class="dashboard-table">

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
          <td>
            <v-layout justify-center align-center row fill-height>
              <v-icon>share</v-icon>
              <v-icon class="ml-3">archive</v-icon>
            </v-layout>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import DashboardActionBtn from '@/components/particles/buttons/DashboardActionButton';

export default {
  name: 'DashboardContent',
  components: {
    DashboardActionBtn
  },
  data () {
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
          value: 'members'
        },
        {
          text: 'last changes',
          sortable: false,
          value: 'last changes'
        },
        {
          text: 'actions',
          sortable: false,
          value: 'actions'
        }
      ],
      items: [
        {
          name: 'Skellorbit',
          index: 4,
          last_changes: 'a day ago'
        },
        {
          name: 'Skellorbit',
          index: 4,
          last_changes: '2 days ago'
        },
        {
          name: 'Skellorbit',
          index: null,
          last_changes: 'a day ago'
        }
      ]
    };
  },
};
</script>
