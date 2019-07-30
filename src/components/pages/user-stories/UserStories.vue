<template>
  <div class="stories-container">
    <story-header />
    <story-sidebar />
    <circular-loader
      cls="loader-shadow"
      :visible="loading"
    />
    <story-section v-if="!loading" />
    <!--<tool-section />-->
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
      loaded: {
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
    storyType () {
      return _.first(this.$route.params.storyType.split('-'));
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

      this.connect('dictionary', 'entity/setList', this.filter, true, () => {
        this.loaded['dictionary'] = true;
      });

      let filter = JSON.parse(JSON.stringify(this.filter));
      filter.$or[0]['fullDocument.type'] = this.storyType;
      this.connect('section', 'entity/setList', filter, true, () => {
        this.loaded['section'] = true;
        let orderList = _.chain(this.sections)
          .map(item => item.storyOrder)
          .flatten()
          .value();

        let filter = JSON.parse(JSON.stringify(this.filter));
        filter.$or[0] = { 'fullDocument._id': { '$in': orderList } };

        this.connect('story', 'entity/setList', filter, true, () => {
          this.loaded['story'] = true;
          console.log(this.$store.getters['entity/items']('story'));
        });
      });
    },
    resetData () {
      this.loaded = {
        dictionary: false,
        section: false,
        story: false
      };

      this.$store.commit('entity/resetList', ['dictionary', 'section', 'story']);
    },
    fixRoute () {
      let stub = this.$route.params.section === 'section';

      if (this.sections.length && stub) {
        const url = this.$route.path.replace('section', this.sections[0].id);
        this.$router.replace(url);
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
    storyType () {
      this.fetchData();
    },
    loaded: {
      deep: true,
      handler () {
        if (this.loaded.dictionary && this.loaded.section && this.loaded.story) {
          this.processing = false;
          this.fixRoute();
        }
      }
    }
  }
};
</script>
