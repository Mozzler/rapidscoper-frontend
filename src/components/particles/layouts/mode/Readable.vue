<template>
  <div class="display-contents" v-if="!processing">
    <sidebar-full-list class="noprint"/>
    <story-content-static />
    <comments />
  </div>
</template>

<script>
import SidebarFullList from '../../../particles/lists/SidebarFullList';
import StoryContentStatic from '../../../particles/layouts/StoryContentStatic';
import Comments from '../../lists/Comments';

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
  }
};
</script>
