<template>
  <div class="content-container">
    <v-layout align-start justify-center row fill-height>
      <div class="content">
        <story-item v-for="(story, index) in sections"
          :model="story"
          :key="index" />
      </div>
    </v-layout>
  </div>
</template>

<script>
import StoryItem from '../../particles/forms/StoryItem';

export default {
  name: "StoryContent",
  components: {
    StoryItem
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
      return this.$store.getters['entity/items']('sections');
    },
    activeSectionId () {
      return this.$route.params.section;
    },
    projectId () {
      return this.$route.params.projectId;
    },
    projects () {
      return this.$store.getters['entity/items']('projects');
    },
    activeProject () {
      return this.projects.find(item => item.id === this.projectId);
    }
  },
  methods: {
    createSection () {
      const untitled = this.sections.filter(item => item.name.includes('Untitled'));
      const number = untitled.length;

      const section = {
        entity: 'section',
        data: {
          name: `Untitled${number ? ' ' + number : ''}`,
          description: '',
          projectId: this.activeProject.id,
          teamId: this.activeProject.teamId
        }
      };

      this.$store.dispatch('entity/create', section)
        .then(response => {
          this.$router.push({
            name: 'stories',
            params: {
              project: this.projectId,
              section: this.sections[this.sections.length-1].id,
              tab: this.$route.params.tab
            }
          });
        });
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
