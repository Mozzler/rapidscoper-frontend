<template>
  <div class="content-container">
    <v-layout align-start justify-center row fill-height>
      <div class="content">
        <story-item />
      </div>
    </v-layout>
  </div>
</template>

<script>
import StoryItem from '../../particles/forms/StoryItem';

export default {
  name: "StoryContent",
  components: {
    StoryItem
  }
}
</script>

<style scoped>

</style>
