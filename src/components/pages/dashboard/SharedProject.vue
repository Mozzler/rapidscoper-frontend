<template>
  <div class="stories-container--public">
    <circular-loader
      cls="loader-shadow--without-padding transparent"
      :size="50"
      :width="5"
      :visible="processing" />

    <template v-if="!processing">
      <sidebar-full-list />
      <story-content-static />
    </template>
  </div>
</template>

<script>
import CircularLoader from '../../particles/loaders/Circular';
import SidebarFullList from '../../particles/lists/SidebarFullList';
import StoryContentStatic from '../../particles/layouts/StoryContentStatic';

export default {
  name: "SharedProject",
  components: {
    CircularLoader,
    SidebarFullList,
    StoryContentStatic
  },
  data () {
    return {
      processing: true
    };
  },
  computed: {
    params () {
      return this.$route.params;
    }
  },
  beforeMount () {
    this.fetchData();
  },
  methods: {
    fetchData () {
      this.processing = true;
      const payload = _.pick(this.params, 'projectShareId', 'token');

      this.$store.dispatch('projectVersion/post', payload)
        .then(() => {
          this.processing = false;
        });
    }
  }
};
</script>
