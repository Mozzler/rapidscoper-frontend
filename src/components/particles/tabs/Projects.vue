<template>
  <div class="table-container">
    <div class="table-dropdown menu-relative">
      <dropdown :list="dropdown" :selected="active"
        @update="value => active = value"/>
    </div>

    <v-data-table
      :loading="initialization"
      :headers="headers"
      :items="projects"
      item-key="name"
      :hide-actions="true"
      class="dashboard-table projects-table">

      <template v-slot:items="props">
        <tr @click="props.expanded = !props.expanded">
          <td>
            <div @click="() => goTo(props.item.name, props.item.id)" class="cursor-pointer">
              {{ props.item.name }}
            </div>
            <span class="index" v-if="props.item.index">
              {{ props.item.index }}
            </span>
          </td>
          <td>
            <v-layout align-center justify-start row fill-height>
              <v-flex v-for="i in 3" :key="i" shrink mr-2>
                <img src="@/assets/img/user.png" />
              </v-flex>
            </v-layout>
          </td>
          <td>{{ props.item.updatedAt | toDate }}</td>
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
      loading: true
    };
  },
  beforeMount () {
    this.fetchProjects();
  },
  methods: {
    goTo (item, id) {
      const url = `/projects/${id}/user-story/section/edit`;
      this.$router.push(url);
    },
    fetchProjects () {
      this.$store.commit('entity/resetList', 'project');

      const filter = {
        $or: [
          { 'fullDocument.teamId': { '$in': [this.activeTeamId] } }
        ]
      };
      this.connect('project', 'entity/setList', filter);
    }
  },
  computed: {
    projects () {
      return this.$store.getters['entity/items']('project');
    },
    activeTeamId () {
      return this.$route.params.name;
    }
  },
  watch: {
    activeTeamId () {
      this.fetchProjects();
    }
  }
};
</script>
