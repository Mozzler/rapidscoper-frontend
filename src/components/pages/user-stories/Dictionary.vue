<template>
  <div class="stories-container--short">
    <story-header
      :tabs-panel="false"
      :heading="'Dictionary'"
    />
    <story-sidebar />
    <story-section />
    <dictionary-layout />
  </div>
</template>

<script>
import StoryHeader from "../../particles/navigation/StoryHeader";
import StorySidebar from "../../particles/navigation/USidebar";
import StorySection from "../../particles/navigation/StorySection";
import DictionaryLayout from "../../particles/inputs/DictionaryLayout";

export default {
  name: "Dictionary",
  components: {
    StoryHeader,
    StorySidebar,
    StorySection,
    DictionaryLayout
  }
};
</script>
