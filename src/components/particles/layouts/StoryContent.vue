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
    }
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

      if (this.sections[index].id !== this.activeSectionId) {
        const url = this.$route.path.replace(this.activeSectionId, this.sections[index].id);
        this.$router.replace(url);
      }
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
          teamId: this.activeProject.teamId
        }
      };
    },
    async createSection () {
      const section = this.getSectionData();

      await this.$store.dispatch('entity/create', section);
      this.$socket.recreateWatchers('story', true);
    },
    scrollToActiveSection () {
      const el = document.getElementById(this.activeSectionId);
      if (el) {
        el.scrollIntoView();
        this.$refs['scrollable-layout'].addEventListener('scroll', this.handleScroll);
      }
    }
  },
  watch: {
    activeSectionId () {
      this.$refs['scrollable-layout'].removeEventListener('scroll', this.handleScroll);
      this.scrollToActiveSection();
    }
  }
};
</script>
