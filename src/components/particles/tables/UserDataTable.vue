<template>
  <v-data-table
    :headers="headers"
    :items="projects"
    item-key="name"
    :hide-actions="true"
    :loading="loading || processing || updating"
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
                 :src="item ? item : '@/assets/img/default-user.png'"
                 :key="index"/>
          </v-layout>
        </td>
        <td>{{ props.item.updatedAt | toDate }}</td>
        <td>
          <v-layout align-center justify-space-between row fill-height>
            <v-icon @click="() => share(props.item.id)">share</v-icon>
            <template>
              <v-icon @click="() => setStatus(props.item.id, 'archived')"
                      v-if="props.item.status !== 'archived'">
                archive
              </v-icon>
              <v-icon @click="() => setStatus(props.item.id, 'active')"
                      v-else>
                unarchive
              </v-icon>
            </template>
          </v-layout>
        </td>
      </tr>
      <span class="tr-border" />
    </template>
  </v-data-table>
</template>

<script>
import CircularLoader from '../../particles/loaders/Circular';

export default {
  name: 'UserDataTable',
  components: {
    CircularLoader
  },
  props: {
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
      updating: false,
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
    this.connect('projectShare', 'entity/setList');
    this.$root.$on('dataset-updated', this.datasetUpdated);
    this.fetchData();
  },
  beforeDestroy () {
    this.$root.$off('dataset-updated', this.datasetUpdated);
  },
  computed: {
    projectsWithMembers () {
      return this.$store.getters['entity/projectsWithMembers'](this.teamId);
    },
    projects () {
      return _.filter(this.projectsWithMembers, project => {
        if (this.route === 'shared-with-me') {
          return project.createdUserId !== this.user.user_id;
        } else if (this.route === 'archived') {
          return project.status === 'archived';
        } else {
          return project.status === 'active';
        }
      });
    },
    user () {
      return this.$store.state.auth.user;
    },
    teamId () {
      return this.$route.params.section === 'team' ? this.$route.params.name : null;
    },
    route () {
      return this.$route.params.name;
    }
  },
  methods: {
    datasetUpdated () {
      this.updating = false;
    },
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
    },
    async setStatus (id, status) {
      const data = {
        entity: 'project',
        params: {
          id: id
        },
        data: {
          status: status
        }
      };

      this.processing = true;
      await this.$store.dispatch('entity/update', data);
      this.processing = false;
    },
    share (id) {
      this.$root.$emit('share-project', id);
    }
  },
  watch: {
    '$route.params.name' () {
      this.fetchData();

      this.updating = true;
      this.$socket.recreateWatchers('project', true);
    }
  }
};
</script>
