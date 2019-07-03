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
    }
  },
  methods: {
    createSection () {
      const item = {
        name: 'Untitled',
        description: ''
      };
      this.$store.commit('entity/create', {
        entity: 'sections',
        data: item
      });
    },
    scrollToActiveSection() {
      const el = document.getElementById(this.activeSectionId);
      el.scrollIntoView();
    }
  },
  watch: {
    activeSectionId () {
      this.scrollToActiveSection();
    }
  }
};
</script>
