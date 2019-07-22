<template>
  <div class="stories-container">
    <story-header />
    <story-sidebar />
    <circular-loader
      cls="loader-shadow"
      :visible="processing || initialization"
    />
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
import CircularLoader from "../../particles/loaders/Circular";

export default {
  name: "UserStories",
  components: {
    StoryHeader,
    StorySidebar,
    StorySection,
    ToolSection,
    StoryContent,
    CircularLoader
  },
  data () {
    return {
      processing: false
    };
  },
  computed: {
    sections () {
      return this.$store.getters['entity/items']('section');
    },
    projects () {
      return this.$store.getters['entity/items']('project');
    },
    activeProjectId () {
      return this.$route.params.projectId;
    },
    stories () {
      return this.$store.getters['entity/total']('story');
    }
  },
  beforeMount () {
    this.fetchData();
  },
  methods: {
    fetchData () {
      this.processing = true;

      const filter = {
        $or: [
          { 'fullDocument.projectId': { '$in': [ this.activeProjectId ] } }
        ]
      };

      const entities = ['section', 'dictionary', 'story'];
      entities.forEach(entity => {
        this.connect(entity, 'entity/setList', filter, true, () => {
          if (entity === 'story') {
            this.processing = false;
          }
        });
      });
    },
    resetData () {
      this.processing = true;
      const entities = ['section', 'story', 'dictionary'];
      entities.forEach(entity => {
        this.$store.commit('entity/resetList', entity);
      });
    }
  },
  beforeDestroy () {
    this.resetData();
  },
  watch: {
    activeProjectId () {
      this.fetchData();
    },
    initialization () {
      if (!this.initialization) {
        const stub = this.$route.params === 'section';
        if (this.sections.length && stub) {
          const url = this.$route.params.replace('section', this.sections[0].id);
          this.$router.push(url);
        }
      }
    }
  }
};
</script>
