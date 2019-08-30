<template>
  <div :class="{
      'stories-container--public': storyViewMode,
      'stories-container': !storyViewMode,
    }">
    <story-header @share-project="share"/>
    <editable-layout v-if="!storyViewMode" />
    <readable-layout v-else />
  </div>
</template>

<script>
import StoryHeader from '../../particles/navigation/StoryHeader';
import EditableLayout from '../../particles/layouts/mode/Editable';
import ReadableLayout from '../../particles/layouts/mode/Readable';

import { mapState } from 'vuex';

export default {
  name: 'UserStories',
  components: {
    StoryHeader,
    EditableLayout,
    ReadableLayout
  },
  methods: {
    share () {
      this.$store.commit('story/setActiveStoryOnTab', null);
      this.$nextTick(() => {
        this.$root.$emit('share-project', this.$route.params.projectId);
      });
    }
  },
  computed: {
    ...mapState({
      storyViewMode: state => state.system.storyViewMode
    })
  }
};
</script>
