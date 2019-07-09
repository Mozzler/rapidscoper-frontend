<template>
  <div class="stories-container">
    <story-header />
    <story-sidebar />
    <div class="loader-shadow" v-if="processing">
      <v-progress-circular
        :size="70"
        :width="7"
        indeterminate
      ></v-progress-circular>
    </div>
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
  data () {
    return {
      processing: false
    };
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
      this.processing = true;
      const entities = ['section', 'dictionary', 'story'];
      const queries = entities.map(entity => {
        return this.$store.dispatch('entity/read', {
          entity: entity,
          params: {
            projectId: this.$route.params.projectId,
            sort: '-createdAt'
          }
        });
      });

      return Promise.all(queries);
    },
    fetchData () {
      this.getQuerySet().then(() => {
        this.processing = false;
        const stub = this.$route.params === 'section';

        if (this.sections.length && stub) {
          const url = this.$route.params.replace('section', this.sections[0].id);
          this.$router.push(url);
        }
      });
    },
    resetData () {
      this.processing = true;
      const entities = ['sections', 'story', 'dictionary'];
      entities.forEach(item => {
        this.$store.commit('entity/resetList', {
          entity: item
        });
        this.processing = false;
      });
    }
  },
  beforeDestroy () {
    this.resetData();
  },
  watch: {
    '$route.params.projectId' () {
      this.fetchData();
    }
  }
};
</script>
