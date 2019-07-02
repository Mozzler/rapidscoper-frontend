<template>
  <div class="sidebar story-section pt-4">
    <sidebar-list
      title="user story sections"
      btn="Add section"
      :list="sections"
      :active="$route.params.section ? $route.params.section : sections[0].name"
      @go="value => goTo(value)"
      @add="addSection" />
  </div>
</template>

<script>
import SidebarList from "../lists/SidebarList";
import Navigation from '@/mixins/navigation';

export default {
  name: "StorySection",
  components: {
    SidebarList,
  },
  mixins: [
    Navigation
  ],
  computed: {
    sections () {
      return this.$store.getters['entity/items']('sections');
    }
  },
  methods: {
    addSection () {
      this.$root.$emit('create-new-section');
    },
    goTo (value) {
      this.$router.push({
        name: 'stories',
        params: {
          project: this.$route.params.project,
          section: value,
          tab: this.$route.params.tab
        }
      });
    }
  }
};
</script>
