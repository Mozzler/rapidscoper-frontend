<template>
  <div class="header">
    <v-layout align-center justify-space-between row fill-height>
      <v-flex>
        <div class="white-space-nowrap">
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
        </div>
      </v-flex>
      <v-flex>
        <template v-if="tabsPanel && !storyViewMode">
          <v-tabs fixed-tabs
                  class="tabs stories-tabs"
                  hide-slider
                  v-model="activeTab">
            <v-tab v-for="tab in tabs" :key="tab" @click="setTab(tab)">
              <div :class="{'onboarding': checkOnBoardFlag(tab)}">{{ tab }}</div>
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
                 :disabled="initialization"
                 @click="share">
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
import IntroductionMixin from '@/mixins/introduction';

import { mapState, mapMutations } from 'vuex';

export default {
  name: 'StoryHeader',
  components: {
    SortIcon,
    Dropdown
  },
  mixins: [
    Navigation,
    IntroductionMixin
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
      collections: [
        'userInfo', 'invite', 'project', 'userProject'
      ],
      tabs: [
        'Edit', 'Estimates', 'Priorities', 'Labels', 'Comments'
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
    ...mapMutations('system', [
      'setSidebarFilter',
      'setStoryViewMode',
      'setLoadedState'
    ]),
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
    share () {
      this.$store.commit('story/setActiveStoryOnTab', null);
      this.$nextTick(() => {
        this.$root.$emit('share-project', this.currentProjectId);
      });
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
    },
    checkOnBoardFlag (key) {
      const flag = (() => {
        switch (key) {
          case 'Edit':
            return this.C.INTRO_COMMENT_FIND;
          case 'Estimates':
            return this.C.INTRO_EDITING;
          case 'Priorities':
            return this.C.INTRO_METADATA;
          case 'Labels':
            return this.C.INTRO_LABELS;
          case 'Comments':
            return this.C.INTRO_COMMENTS;
        }
      })();

      return this.checkActiveChapter(flag);
    }
  },
  beforeMount () {
    _.each(this.collections, key => {
      this.connect(key, 'entity/setList', null, true, () => this.setLoadedState({ key, value: true }));
    });
  },
  watch: {
    tab () {
      this.activeTab = this.tabs.indexOf(this.tab);
    }
  }
};
</script>
