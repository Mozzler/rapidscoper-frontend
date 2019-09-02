<template>
  <div class="display-contents">
    <story-sidebar />
    <template v-if="!processing">
      <story-section />
      <story-content />
    </template>
    <tool-section />
  </div>
</template>

<script>
import StorySidebar from '../../../particles/navigation/USidebar';
import StorySection from '../../../particles/navigation/StorySection';
import ToolSection from '../../../particles/navigation/ToolSection';
import StoryContent from '../../../particles/layouts/StoryContent';

export default {
  name: 'Editable',
  components: {
    StorySidebar,
    StorySection,
    ToolSection,
    StoryContent
  },
  props: {
    processing: {
      default: false
    }
  }
};
</script>
