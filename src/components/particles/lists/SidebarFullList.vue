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

export default {
  name: 'SidebarFullList',
  components: {
    SidebarList
  },
  computed: {
    chapters () {
      return this.$store.getters['projectVersion/chapters'];
    }
  },
  methods: {
    goTo (id) {
      this.$router.replace({
        name: this.$route.name,
        params: {
          section: id
        }
      });
    }
  }
};
</script>
