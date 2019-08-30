<template>
  <div class="display-contents" v-if="!processing">
    <sidebar-full-list class="noprint"/>
    <story-content-static />
  </div>
</template>

<script>
import SidebarFullList from '../../../particles/lists/SidebarFullList';
import StoryContentStatic from '../../../particles/layouts/StoryContentStatic';

export default {
  name: 'Readable',
  components: {
    SidebarFullList,
    StoryContentStatic
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
