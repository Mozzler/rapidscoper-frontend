<template>
  <div class="u-sidebar mini-sidebar pt-4">
    <icon-list
      :title="req.title"
      :list="req.list"
      :activeIcon="activeIcon"
      @click="click"
    />
    <icon-list
      :title="imp.title"
      :list="imp.list" />
  </div>
</template>

<script>
import IconList from '../lists/IconList';

export default {
  name: 'StorySidebar',
  components: {
    IconList
  },
  data () {
    return {
      drawer: true,
      req: {
        title: 'REQ.',
        list: {
          'functional-requirements-icon': false,
          'technical-requirements-icon': false
        }
      },
      imp: {
        title: 'IMP.',
        list: {
          /*'storage': true,
          'verified_user': true,
          'sitemap-icon': false,
          'extension': true,
          'done_all': true,*/
          'book-icon': false,
          //'attach_file': true
        }
      }
    };
  },
  computed: {
    activeIcon () {
      switch (true) {
        case this.$route.name === 'stories':
          const section = this.$route.params.storyType;
          if (section === 'user-story') {
            return 'functional-requirements-icon';
          }
          if (section === 'technical-story') {
            return 'technical-requirements-icon';
          }
      }
    }
  },
  methods: {
    click (item) {
      let data = null;

      switch (item) {
        case 'functional-requirements-icon':
        case 'technical-requirements-icon':
          data = {
            name: 'stories',
            params: {
              projectId: this.$route.params.projectId,
              storyType: item === 'functional-requirements-icon' ?
                'user-story' : 'technical-story',
              section: 'section',
              tab: this.$route.params.tab
            }
          };
          break;
      }

      this.$router.push(data);
    }
  }
};
</script>
