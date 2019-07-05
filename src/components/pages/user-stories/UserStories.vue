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
    this.fetchData();
  },
  methods: {
    getQuerySet () {
      const entities = ['section', 'dictionary', 'story'];
      const queries = entities.map(entity => {
        return this.$store.dispatch('entity/read', {
          entity: entity,
          params: {
            projectId: this.$route.params.projectId
          }
        });
      });

      return Promise.all(queries);
    },
    fetchData () {
      this.getQuerySet().then(() => {
        const stub = this.$route.params === 'section';

        if (this.sections.length && stub) {
          const url = this.$route.params.replace('section', this.sections[0].id);
          this.$router.push(url);
        }
      });
    }
  },
  watch: {
    '$route.params' () {
      this.fetchData();
    }
  }
};
</script>
