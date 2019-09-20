<template>
  <div class="sidebar story-section pt-4">
    <sidebar-list
      class="mb-3"
      v-for="(list, key) in chapters"
      :key="key"
      :title="key"
      :list="list"
      :active="$route.params.section"
      @go="(value, id) => goTo(id)"/>
  </div>
</template>

<script>
import SidebarList from '../lists/SidebarList';
import { mapGetters } from 'vuex';

import ScrollGoToMixin from '@/mixins/scroll-go-to';

export default {
  name: 'SidebarFullList',
  inject: ['entity'],
  components: {
    SidebarList
  },
  mixins: [
    ScrollGoToMixin
  ],
  computed: {
    ...mapGetters({
      chapterGetter: 'projectVersion/chapters'
    }),
    chapters () {
      return this.chapterGetter(this.entity);
    }
  }
};
</script>
