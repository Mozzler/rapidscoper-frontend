<template>
  <div class="content-container">
    <v-layout align-start justify-center row fill-height>
      <div class="content">
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
      message: null
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
    getStoryData () {
      return {
        entity: 'story',
        data: {
          type: 'user',
          markup: this.createSpan('beginning', 'As a', true),
          sectionId: null,
          projectId: this.activeProject.id,
          teamId: this.activeProject.teamId
        }
      };
    },
    async createSection () {
      const section = this.getSectionData();
      const story = this.getStoryData();

      await this.$store.dispatch('entity/create', section);
      story.data.sectionId = this.sections[this.sections.length - 1].id;
      this.$socket.recreateWatchers('section');

      this.$store.dispatch('entity/create', story)
        .then(() => this.$socket.recreateWatchers('story'))
        .then(() => {
          this.$router.push({
            name: 'stories',
            params: {
              project: this.projectId,
              section: this.sections[this.sections.length - 1].id,
              tab: this.$route.params.tab
            }
          });
        });
    },
    scrollToActiveSection () {
      const el = document.getElementById(this.activeSectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
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
