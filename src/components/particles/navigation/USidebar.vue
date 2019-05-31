<template>
  <div class="u-sidebar mini-sidebar pt-4">
    <icon-list :title="req.title" :list="req.list" />
    <icon-list :title="imp.title" :list="imp.list" />
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
          'storage': true,
          'verified_user': true,
          'sitemap-icon': false,
          'extension': true,
          'done_all': true,
          'book-icon': false,
          'attach_file': true
        }
      }
    };
  }
};
</script>
