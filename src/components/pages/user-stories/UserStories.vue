<template>
  <div class="stories-container">
    <story-header />
    <story-sidebar />
    <div class="section">SECTIONS</div>
    <div class="content"></div>
    <div class="r-sidebar">SIDEBAR2</div>
  </div>
</template>

<script>
import StoryHeader from "../../particles/navigation/StoryHeader";
import StorySidebar from "../../particles/navigation/StorySidebar";
export default {
  name: "UserStories",
  components: {
    StoryHeader,
    StorySidebar
  },
}
</script>
