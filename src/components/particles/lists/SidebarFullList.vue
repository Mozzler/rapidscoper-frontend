<template>
  <div class="sidebar story-section pt-4">
    <sidebar-list
      class="mb-3"
      v-for="(list, key) in chapters"
      :key="key"
      :title="key"
      :list="list" />
  </div>
</template>

<script>
import SidebarList from "../lists/SidebarList";

export default {
  name: "SidebarFullList",
  components: {
    SidebarList
  },
  computed: {
    chapters () {
      return this.$store.getters['projectVersion/chapters'];
    }
  }
};
</script>
