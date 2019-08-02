<template>
  <div class="stories-container--short">
    <story-header
      :tabs-panel="false"
      :heading="'Dictionary'"
    />
    <circular-loader
      cls="loader-shadow"
      :visible="loading"
    />
    <story-section v-if="!loading" />
    <story-sidebar />
    <dictionary-layout v-if="!loading" />
  </div>
</template>

<script>
import StoryHeader from "../../particles/navigation/StoryHeader";
import StorySidebar from "../../particles/navigation/USidebar";
import StorySection from "../../particles/navigation/StorySection";
import DictionaryLayout from "../../particles/inputs/DictionaryLayout";
import CircularLoader from "../../particles/loaders/Circular";

import LayoutMixin from "@/mixins/layout";

export default {
  name: "Dictionary",
  components: {
    StoryHeader,
    StorySidebar,
    StorySection,
    DictionaryLayout,
    CircularLoader
  },
  mixins: [
    LayoutMixin
  ],
  methods: {
    fetchData () {
      this.connect('dictionary', 'entity/setList', this.filter, true, () => {
        this.processing = false;
      });
    },
    resetData () {
      this.$store.commit('entity/resetList', 'dictionary');
    }
  }
};
</script>
