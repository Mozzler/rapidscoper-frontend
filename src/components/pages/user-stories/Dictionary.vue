<template>
  <div class="stories-container">
    <div class="header">
      <span>Dictionary</span>
    </div>
    <story-sidebar />
    <story-section />
    <story-content />
  </div>
</template>

<script>
import StorySidebar from "../../particles/navigation/USidebar";
import StorySection from "../../particles/navigation/StorySection";
import StoryContent from "../../particles/layouts/StoryContent";

export default {
  name: "Dictionary",
  components: {
    StorySidebar,
    StorySection,
    StoryContent,
  }
};
</script>
