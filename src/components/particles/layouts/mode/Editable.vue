<template>
  <div class="display-contents">
    <story-sidebar />
    <template v-if="!processing">
      <story-section />
      <story-content />
    </template>
    <tool-section
      v-if="!isCommentTab" />
    <comments
      :clickable="true"
      :source="commentGetter"
      v-else />
  </div>
</template>

<script>
import StorySidebar from '../../../particles/navigation/USidebar';
import StorySection from '../../../particles/navigation/StorySection';
import StoryContent from '../../../particles/layouts/StoryContent';
import Comments from '../../lists/Comments';
import ToolSection from '../../navigation/ToolSection';

import { mapGetters } from 'vuex';

export default {
  name: 'Editable',
  provide: {
    'entity': 'entity'
  },
  components: {
    ToolSection,
    Comments,
    StorySidebar,
    StorySection,
    StoryContent
  },
  props: {
    processing: {
      default: false
    }
  },
  computed: {
    ...mapGetters({
      commentGetter: 'entity/comments'
    }),
    isCommentTab () {
      return this.$route.params.tab === 'comments';
    }
  }
};
</script>
