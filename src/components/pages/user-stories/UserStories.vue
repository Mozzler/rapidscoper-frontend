<template>
  <div :class="{
      'stories-container': !storyViewMode,
      'stories-container--public': storyViewMode
    }">
    <circular-loader
      cls="loader-shadow--without-padding transparent"
      :size="50"
      :width="5"
      :visible="processing" />

    <story-header
      @share-project="share"/>

    <editable-mode-layout
      v-if="!storyViewMode"
      @processing="state => processing = state" />
    <readable-mode-layout
      v-else-if="storyViewMode"
      @processing="state => processing = state"/>
  </div>
</template>

<script>
import StoryHeader from '../../particles/navigation/StoryHeader';
import EditableModeLayout from '../../particles/layouts/mode/Editable';
import ReadableModeLayout from '../../particles/layouts/mode/Readable';
import CircularLoader from '../../particles/loaders/Circular';

import { mapState } from 'vuex';

export default {
  name: 'UserStories',
  components: {
    StoryHeader,
    EditableModeLayout,
    ReadableModeLayout,
    CircularLoader
  },
  data () {
    return {
      processing: true
    };
  },
  computed: {
    ...mapState({
      storyViewMode: state => state.system.storyViewMode
    })
  },
  methods: {
    share () {
      this.$store.commit('story/setActiveStoryOnTab', null);
      this.$nextTick(() => {
        this.$root.$emit('share-project', this.$route.params.projectId);
      });
    }
  }
};
</script>
