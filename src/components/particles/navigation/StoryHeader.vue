<template>
  <div class="header">
    <v-layout align-center justify-space-between row fill-height>
      <v-flex>
        <v-btn icon class="text-size--18"
          @click="toDashboard">
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <span class="text-size--16">
          <dropdown :list="projects"
                    :editable="true"
                    :submit="submit"
                    :selected="currentProject"
                    @update="item => goToProject(item.name, item.id)" />
        </span>
      </v-flex>
      <v-flex>
        <template v-if="tabsPanel && !storyViewMode">
          <v-tabs fixed-tabs class="tabs stories-tabs" v-model="activeTab">
            <v-tab v-for="tab in tabs" :key="tab" @click="setTab(tab)">
              {{ tab }}
            </v-tab>
          </v-tabs>
        </template>
        <template v-if="heading">
          <div class="text-sm-center text-size--16 cursor-default">
            {{ heading }}
          </div>
        </template>
      </v-flex>
      <v-flex text-xs-right>
        <v-layout align-center justify-end row fill-height>
          <div
            v-if="!storyViewMode"
            class="header-options"
            :class="{'header-options--active': sidebarFilter}"
            @click="() => setSidebarFilter(!sidebarFilter)">
            <sort-icon />
          </div>
          <div class="header-options"
               :class="{'header-options--active': storyViewMode}"
               @click="() => setStoryViewMode(!storyViewMode)">
            <v-icon>visibility</v-icon>
          </div>
          <v-btn class="btn-rapid primary ml-2"
                 large
                 v-if="!storyViewMode"
                 @click="showModal">
            Share
          </v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import SortIcon from '../icons/Filter';
import Dropdown from '../menus/Dropdown';
import Navigation from '@/mixins/navigation';

import { mapMutations } from 'vuex';
import { mapState } from 'vuex';

export default {
  name: 'StoryHeader',
  components: {
    SortIcon,
    Dropdown
  },
  mixins: [
    Navigation
  ],
  props: {
    tabsPanel: {
      default: true,
      required: false
    },
    heading: {
      default: '',
      required: false
    }
  },
  data () {
    return {
      tabs: [
        'Edit', 'Estimates', 'Priorities', 'Labels', /*'Comments'*/
      ],
      activeTab: null
    };
  },
  mounted () {
    this.activeTab = this.tabs.indexOf(this.tab);
  },
  computed: {
    ...mapState({
      sidebarFilter: state => state.system.sidebarFilter,
      storyViewMode: state => state.system.storyViewMode
    }),
    tab () {
      return this.toTitle(this.$route.params.tab);
    },
    projects () {
      return this.$store.getters['entity/items']('project');
    },
    currentProjectId () {
      return this.$route.params.projectId;
    },
    currentProject () {
      return this.projects.find(item => item.id === this.currentProjectId);
    }
  },
  methods: {
    ...mapMutations({
      setSidebarFilter: 'system/setSidebarFilter',
      setStoryViewMode: 'system/setStoryViewMode'
    }),
    setTab (item) {
      let params = this.$route.params;
      params.tab = item.toLowerCase();

      this.$router.push({
        name: this.$route.name,
        params: params
      });
    },
    goToProject (name, id) {
      this.$router.push({
        name: this.$route.name,
        params: {
          ...this.$route.params,
          projectId: id
        }
      });
    },
    toDashboard () {
      this.$router.push('/');
    },
    showModal () {
      this.$emit('share-project');
    },
    async submit (value, id) {
      if (value === this.currentProject.name) {
        return;
      }

      const data = {
        entity: 'project',
        params: {
          id: id
        },
        data: {
          name: value
        }
      };
      try {
        await this.$store.dispatch('entity/update', data);
      } catch (error) {
        if (error.response && error.response.data) {
          this.$root.$emit('show-error-message', error.response.data[0].message);
        }
        return 'error';
      }
    }
  },
  beforeMount () {
    this.connect('project', 'entity/setList', false);
  },
  watch: {
    tab () {
      this.activeTab = this.tabs.indexOf(this.tab);
    }
  }
};
</script>
