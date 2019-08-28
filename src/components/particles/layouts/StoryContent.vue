<template>
  <div>
    <div class="content-filter" v-if="sidebarFilter">
      <sidebar-filters />
    </div>
    <div class="scrollable-layout" ref="scrollable-layout">
      <div class="content-container"
           v-for="(story, index) in sections"
           :key="index">
        <v-layout align-start justify-center row fill-height>
          <div class="content" ref="layout-content">
            <story-item
              :model="story"
              ref="storyItem"
              @show-error="value => message = value"/>
          </div>
          <hint />
          <alert :message="message" />
        </v-layout>
      </div>
    </div>
  </div>
</template>

<script>
import StoryItem from '../../particles/forms/StoryItem';
import Hint from '../lists/Hint';
import SidebarFilters from '../../particles/inputs/SidebarFilters';

import ScrollMixin from '@/mixins/scroll';

export default {
  name: 'StoryContent',
  components: {
    StoryItem,
    Hint,
    SidebarFilters
  },
  mixins: [
    ScrollMixin
  ],
  data () {
    return {
      message: null,
      scrollActive: false,
      scrollSelector: '.user-story__block',
    };
  },
  beforeMount () {
    this.$root.$on('create-new-section', this.createSection);
    this.$root.$on('show-error-message', this.setErrorMessage);
  },
  beforeDestroy () {
    this.$root.$off('create-new-section');
    this.$root.$off('show-error-message');
  },
  computed: {
    sections () {
      return this.$store.getters['story/orderedSections'](this.projectId, this.storyType);
    },
    activeSectionId () {
      return this.$route.params.section;
    },
    projectId () {
      return this.$route.params.projectId;
    },
    projects () {
      return this.$store.getters['entity/items']('project');
    },
    activeProject () {
      return this.projects.find(item => item.id === this.projectId);
    },
    storyType () {
      const splitted = this.$route.params.storyType.split('-');
      return _.first(splitted);
    },
    sidebarFilter () {
      return this.$store.state.system.sidebarFilter;
    }
  },
  methods: {
    setErrorMessage (error) {
      this.message = error;
    },
    getSectionData () {
      const untitled = this.sections.filter(item => item.name.includes('Untitled'));
      const number = untitled.length;

      return {
        entity: 'section',
        data: {
          name: `Untitled${number ? ' ' + number : ''}`,
          description: '',
          projectId: this.activeProject.id,
          teamId: this.activeProject.teamId,
          type: this.storyType
        }
      };
    },
    async createSection () {
      const section = this.getSectionData();

      await this.$store.dispatch('entity/create', section);

      let orderList = _.chain(this.sections)
        .map(item => item.storyOrder)
        .flatten()
        .value();

      let filter = {
        $or: [
          { 'fullDocument._id': { '$in': [ orderList ] } }
        ]
      };
      this.$socket.recreateWatchers('story', true, filter);
    }
  }
};
</script>
