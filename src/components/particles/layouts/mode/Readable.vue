<template>
  <div>
    <circular-loader
      cls="loader-shadow"
      :visible="loading"
    />
    <sidebar-full-list  class="noprint"/>
    <story-content-static />
  </div>
</template>

<script>
import SidebarFullList from '../../../particles/lists/SidebarFullList';
import StoryContentStatic from '../../../particles/layouts/StoryContentStatic';
import CircularLoader from '../../../particles/loaders/Circular';

export default {
  name: 'Readable',
  components: {
    SidebarFullList,
    StoryContentStatic,
    CircularLoader
  },
  data () {
    return {
      loading: false
    };
  },
  beforeMount () {
    this.fetchData();
  },
  methods: {
    async fetchData () {
      this.loading = true;
      await this.$store.dispatch('projectVersion/view', this.params);
      this.loading = false;
    }
  },
  computed: {
    params () {
      return {
        params: {
          id: this.$route.params.projectId,
          version: 0
        }
      };
    }
  },
  watch: {
    projectId () {
      this.fetchData();
    }
  }
};
</script>
