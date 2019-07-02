<template>
  <div class="table-container">
    <div class="table-dropdown menu-relative">
      <dropdown :list="dropdown" :selected="active"
        @update="value => active = value"/>
    </div>

    <v-data-table
      :loading="loading"
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
              <img src="@/assets/img/user.png" v-for="i in 3" :key="i"/>
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
  beforeDestroy () {
    /*this.$store.commit('entity/setActiveId', ['Project', null]);
    this.$store.commit('entity/setActiveId', ['Team', null]);*/
  },
  methods: {
    goTo (item, id) {
      const project = `projects/${this.itemToParam(item)}`;
      const story = `user-story/mobile-sign-up/edit`;

      this.$store.commit('entity/setActiveId', ['Project', id]);
      this.$router.push(`/${project}/${story}`);
    },
    fetchProjects () {
      this.loading = true;
      let filters = {
        teamId: this.activeTeamId,
        sort: '-createdAt'
      };
      this.$store.dispatch('entity/getList', {
        entity: 'projects',
        params: filters
      }).then(() => {
        this.loading = false;
      }).catch(error => {
        this.loading = false;
        console.log(error);
      });
    }
  },
  computed: {
    projects () {
      return this.$store.getters['entity/items']('projects');
    },
    activeTeamId () {
      return this.$store.state.entity.activeTeamId;
    }
  },
  watch: {
    activeTeamId () {
      this.fetchProjects();
    }
  }
};
</script>
