<template>
  <v-container>
    <v-layout align-center justify-space-between row fill-height>
      <h1>All projects</h1>
      <dashboard-action-btn
        @show-modal="showModal"
        :text="'Create new project'"
        :mobile="true">
        <template #mobile>
          <v-btn icon class="primary" @click="showModal">
            <v-icon>add</v-icon>
          </v-btn>
        </template>
      </dashboard-action-btn>
    </v-layout>
    <v-data-table
        :headers="headers"
        :items="projects"
        item-key="name"
        :hide-actions="true"
        :loading="initialization"
        class="dashboard-table">

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
          <!--<td>
            <v-layout align-center justify-space-between row fill-height>
              <v-icon>share</v-icon>
              <v-icon>archive</v-icon>
            </v-layout>
          </td>-->
        </tr>
        <span class="tr-border" />
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
      showCreateProjectModal: false,
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
        /*{
          text: 'actions',
          sortable: false,
          value: 'actions'
        }*/
      ]
    };
  },
  methods: {
    showModal () {
      this.$root.$emit('create-project');
    },
    goTo (item, id) {
      const url = `/projects/${id}/user-story/section/edit`;
      this.$router.push(url);
    }
  },
  computed: {
    user () {
      return this.$store.state.auth.user;
    },
    projects () {
      const projects = this.$store.getters['entity/items']('project');
      return _.filter(projects, project => {
        let externalProject = project.createdUserId !== this.user.user_id;
        return this.sharedRoute ? externalProject : project;
      });
    },
    sharedRoute () {
      return this.$route.params.name === 'shared-with-me';
    }
  }
};
</script>
