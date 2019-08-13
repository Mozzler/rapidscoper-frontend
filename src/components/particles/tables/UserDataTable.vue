<template>
  <v-data-table
    :headers="headers"
    :items="projects"
    item-key="name"
    :hide-actions="true"
    :loading="loading || processing"
    :class="`dashboard-table ${cls}`">

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
            <img v-for="(item, index) in props.item.members"
                 :src="item"
                 :key="index"/>
          </v-layout>
        </td>
        <td>{{ props.item.updatedAt | toDate }}</td>
        <td v-if="actions">
          <v-layout align-center justify-space-between row fill-height>
            <v-icon>share</v-icon>
            <v-icon>archive</v-icon>
          </v-layout>
        </td>
      </tr>
      <span class="tr-border" />
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "UserDataTable",
  props: {
    actions: {
      default: false
    },
    loading: {
      default: false
    },
    cls: {
      default: ''
    }
  },
  data () {
    return {
      processing: false,
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
      ]
    };
  },
  beforeMount () {
    this.fetchData();
  },
  computed: {
    projects () {
      const projects = this.$store.getters['entity/projectsWithMembers'](this.teamId);

      return _.filter(projects, project => {
        let externalProject = project.createdUserId !== this.user.user_id;
        return this.sharedRoute ? externalProject : project;
      });
    },
    user () {
      return this.$store.state.auth.user;
    },
    teamId () {
      return this.$route.params.section === 'team' ? this.$route.params.name : null;
    },
    sharedRoute () {
      return this.$route.params.name === 'shared-with-me';
    }
  },
  methods: {
    fetchData () {
      this.processing = true;

      let payload = {
        params: {}
      };

      if (this.teamId) {
        payload.params = {
          teamId: this.teamId
        };
      }

      Promise.all([
        this.$store.dispatch('entity/read', {
          entity: 'user-project',
          params: payload
        }),
        this.$store.dispatch('entity/read', {
          entity: 'user-info'
        })
      ]).then(() => {
        this.processing = false;
      });
    },
    goTo (item, id) {
      const url = `/projects/${id}/user-story/section/edit`;
      this.$router.push(url);
    }
  }
};
</script>
