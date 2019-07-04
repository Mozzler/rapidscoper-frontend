<template>
  <div class="stories-container">
    <story-header />
    <story-sidebar />
    <story-section />
    <tool-section />
    <story-content />
  </div>
</template>

<script>
import StoryHeader from "../../particles/navigation/StoryHeader";
import StorySidebar from "../../particles/navigation/USidebar";
import StorySection from "../../particles/navigation/StorySection";
import ToolSection from "../../particles/navigation/ToolSection";
import StoryContent from "../../particles/layouts/StoryContent";

export default {
  name: "UserStories",
  components: {
    StoryHeader,
    StorySidebar,
    StorySection,
    ToolSection,
    StoryContent
  },
  computed: {
    sections () {
      return this.$store.getters['entity/items']('sections');
    }
  },
  beforeMount () {
    this.$store.dispatch('entity/getList', { entity: 'section' })
      .then(response => {
        const stub = this.$route.params === 'section';

        if (this.sections.length && stub) {
          const url = this.$route.params.replace('section', this.sections[0].id);
          this.$router.push(url);
        }
      });
  }
};
</script>
