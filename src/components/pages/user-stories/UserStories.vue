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
}
</script>
