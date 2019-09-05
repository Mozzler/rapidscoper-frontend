<template>
  <div class="display-contents" v-if="!processing">
    <sidebar-full-list class="noprint"/>
    <story-content-static />
    <comments
      :source="commentGetter" />
  </div>
</template>

<script>
import SidebarFullList from '../../../particles/lists/SidebarFullList';
import StoryContentStatic from '../../../particles/layouts/StoryContentStatic';
import Comments from '../../lists/Comments';

import { mapGetters } from 'vuex';

export default {
  name: 'Readable',
  components: {
    SidebarFullList,
    StoryContentStatic,
    Comments
  },
  provide: {
    'entity': 'snapshot'
  },
  props: {
    processing: {
      default: false
    }
  },
  computed: {
    ...mapGetters({
      commentGetter: 'projectVersion/comments'
    })
  }
};
</script>
