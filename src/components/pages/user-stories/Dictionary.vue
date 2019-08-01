<template>
  <div class="stories-container--short">
    <div class="header">
      <span>Dictionary</span>
    </div>
    <story-sidebar />
    <story-section />

    <div class="content-container">
      <v-layout align-start justify-center row fill-height>
        <div class="content" ref="scrollable-layout">
          <div class="user-story__block">
            <div class="user-story">
              <h1> Actors </h1>
              <v-layout row fill-height>
                <v-flex shrink mr-1>
                  <input v-model="item.field" />
                </v-flex>
                <v-flex grow text-xs-left>
                  <input v-model="item.description" />
                </v-flex>
              </v-layout>
            </div>
          </div>
        </div>
      </v-layout>
    </div>
  </div>
</template>

<script>
import StorySidebar from "../../particles/navigation/USidebar";
import StorySection from "../../particles/navigation/StorySection";

export default {
  name: "Dictionary",
  components: {
    StorySidebar,
    StorySection,
  },
  data () {
    return {
      processing: false,
      item: {
        field: null,
        description: null
      }
    };
  },
  computed: {
    vocabulary () {
      return this.$store.getters['story/vocabulary'];
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
    }
  },
  beforeMount () {
    this.processing = true;
    this.connect('dictionary', 'entity/setList', this.filter, true, () => {
      this.processing = false;
      console.log(this.$store.state.entity.dictionary.items);
    });
  }
};
</script>
