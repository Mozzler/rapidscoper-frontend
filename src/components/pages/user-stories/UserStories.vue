<template>
  <div class="stories-container">
    <story-header />
    <story-sidebar />
    <circular-loader
      cls="loader-shadow"
      :visible="loading"
    />
    <story-section v-if="!loading" />
    <tool-section />
    <story-content v-if="!loading" />
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
      processing: false,
      collections: ['dictionary', 'section', 'story'],
      loadedCollections: {
        dictionary: false,
        section: false,
        story: false
      }
    };
  },
  computed: {
    sections () {
      return this.$store.getters['entity/items']('section');
    },
    activeProjectId () {
      return this.$route.params.projectId;
    },
    filter () {
      return {
        $or: [
          { 'fullDocument.projectId': { '$in': [ this.activeProjectId ] } }
        ]
      };
    },
    loading () {
      return (this.processing || this.initialization);
    }
  },
  beforeMount () {
    this.fetchData();
  },
  methods: {
    fetchData () {
      this.processing = true;
      this.resetData();

      this.collections.forEach(c => {
        this.connect(c, 'entity/setList', this.filter, true, () => {
          this.loadedCollections[c] = true;
        });
      });
    },
    resetData () {
      this.loadedCollections = {
        dictionary: false,
        section: false,
        story: false
      };

      this.$store.commit('entity/resetList', this.collections);
    },
    fixRoute () {
      let stub = this.$route.params.section === 'section';

      if (this.sections.length && stub) {
        const url = this.$route.path.replace('section', this.sections[0].id);
        this.$router.push(url);
      }
    }
  },
  beforeDestroy () {
    this.resetData();
  },
  watch: {
    activeProjectId () {
      this.fetchData();
    },
    loadedCollections: {
      deep: true,
      handler () {
        if (this.loadedCollections.dictionary && this.loadedCollections.section && this.loadedCollections.story) {
          this.processing = false;
          this.fixRoute();
        }
      }
    }
  }
};
</script>
