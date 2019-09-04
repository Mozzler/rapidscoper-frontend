<template>
  <div class="stories-container--public">
    <circular-loader
      cls="loader-shadow--without-padding transparent"
      :size="50"
      :width="5"
      :visible="processing" />

    <template v-if="!processing">
      <public-header />
      <sidebar-full-list  class="noprint"/>
      <story-content-static />
      <comments />
    </template>
  </div>
</template>

<script>
import CircularLoader from '../../particles/loaders/Circular';
import SidebarFullList from '../../particles/lists/SidebarFullList';
import StoryContentStatic from '../../particles/layouts/StoryContentStatic';

import PublicHeader from '../../particles/navigation/PublicHeader';
import Comments from '../../particles/lists/Comments';

export default {
  name: 'SharedProject',
  provide: {
    'entity': 'projectVersion'
  },
  components: {
    CircularLoader,
    SidebarFullList,
    StoryContentStatic,
    PublicHeader,
    Comments
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
        })
        .catch(error => {
          this.$router.push('/');
        });
    }
  }
};
</script>
