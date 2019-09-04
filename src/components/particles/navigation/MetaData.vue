<template>
  <div class="tool-section pt-4" v-if="toolId">

  </div>
</template>

<script>
import Comments from '../lists/Comments';
import ToolSection from '../navigation/ToolSection';

import { mapState } from 'vuex';

export default {
  name: 'MetaData',
  provide: {
    'entity': 'entity'
  },
  components: {
    Comments,
    ToolSection
  },
  computed: {
    ...mapState({
      toolId: state => state.story.activeStoryOnTab
    }),
    isCommentTab () {
      return this.$route.params.tab === 'comments';
    }
  }
};
</script>
