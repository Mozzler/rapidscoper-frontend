<template>
  <div class="content-container">
    <v-layout align-start justify-center row fill-height>
      <div class="content" ref="scrollable-layout">
        <story-item v-for="(story, index) in sections"
          :model="story"
          :key="index"
          ref="storyItem"
          @show-error="value => message = value"/>
      </div>
      <hint />
      <alert :message="message" />
    </v-layout>
  </div>
</template>

<script>
import StoryItem from '../../particles/forms/StoryItem';
import Hint from "../lists/Hint";

export default {
  name: "StoryContent",
  components: {
    StoryItem,
    Hint
  },
  data () {
    return {
      message: null,
      scrollActive: false
    };
  },
  beforeMount () {
    this.$root.$on('create-new-section', this.createSection);
  },
  beforeDestroy () {
    this.$root.$off('create-new-section');
    this.setScrollListener('remove');
  },
  mounted () {
    this.scrollToActiveSection();
    this.setScrollListener();
  },
  computed: {
    sections () {
      return this.$store.getters['entity/items']('section');
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
  },
  methods: {
    setScrollListener (type = 'add') {
      this.$refs['scrollable-layout'][`${type}EventListener`]('scroll', this.handleScroll);
    },
    handleScroll ($event) {
      if (!this.sections || !this.sections.length) {
        return;
      }

      let offset = $event.target.scrollTop,
          childOffsets = _.map($event.target.children, item => item.offsetTop),
          index = _.findIndex(childOffsets, co => (co + 28) > offset);

      index = index === -1 ? this.sections.length - 1 : index;

      const url = this.$route.path.replace(this.activeSectionId, this.sections[index].id);
      this.$router.replace(url);
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
    },
    scrollToActiveSection () {
      const el = document.getElementById(this.activeSectionId);
      if (el) {
        el.scrollIntoView();
      }
    }
  },
  watch: {
    activeSectionId () {
      this.scrollToActiveSection();
    }
  }
};
</script>
