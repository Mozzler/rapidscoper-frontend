<template>
  <div class="display-contents">
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
  data () {
    return {
      processing: true
    };
  },
  beforeMount () {
    this.fetchData();
  },
  methods: {
    fetchData () {
      const payload = {
        params: {
          id: this.$route.params.projectId,
          version: 0
        }
      };
      this.$emit('processing', true);

      this.$store.dispatch('projectVersion/view', payload)
        .then(() => {
          this.$emit('processing', false);
        })
        .catch(error => {
          this.$router.push('/');
          this.$emit('processing', false);
        });
    }
  }
};
</script>
