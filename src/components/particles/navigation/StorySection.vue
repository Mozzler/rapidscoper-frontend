<template>
  <div class="sidebar story-section pt-4">
    <sidebar-list
      title="user story sections"
      btn="Add section"
      :list="items"
      :active="$route.params.section ? $route.params.section : items[0].title"
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
  data () {
    return {
      items: [
        {
          title: 'Mobile Sign Up'
        },
        {
          title: 'Login'
        },
        {
          title: 'Send Message'
        },
      ]
    }
  },
  methods: {
    addSection () {

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
