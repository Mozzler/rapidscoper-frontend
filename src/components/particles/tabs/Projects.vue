<template>
  <div class="table-container">
    <div class="table-dropdown menu-relative">
      <dropdown :list="dropdown" :selected="active"
        @update="value => active = value"/>
    </div>

    <v-data-table
      :headers="headers"
      :items="items"
      item-key="name"
      :hide-actions="true"
      class="dashboard-table projects-table">

      <template v-slot:items="props">
        <tr @click="props.expanded = !props.expanded">
          <td>
            <div @click="() => goTo(props.item.name)" class="cursor-pointer">
              {{ props.item.name }}
            </div>
            <span class="index" v-if="props.item.index">
              {{ props.item.index }}
            </span>
          </td>
          <td>
            <v-layout align-center justify-start row fill-height>
              <img src="@/assets/img/user.png" v-for="i in 3" :key="i"/>
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
import Dropdown from "../menus/Dropdown";
import Navigation from "@/mixins/navigation";

export default {
  name: 'Projects',
  components: {Dropdown},
  mixins: [
    Navigation
  ],
  data () {
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
  methods: {
    goTo (item) {
      const team = `teams/${this.$route.params.name}`;
      const project = `projects/${this.itemToParam(item)}`;
      const story = `user-story/mobile-sign-up/edit`;

      this.$router.push(`/${team}/${project}/${story}`);
    }
  }
};
</script>
