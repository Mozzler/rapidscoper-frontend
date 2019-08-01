<template>
  <div class="sidebar story-section pt-4">
    <sidebar-list
      :title="title"
      :btn="addBtn"
      :list="list"
      :active="$route.params.section"
      @go="(value, id) => goTo(id)"
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
      addBtn: 'Add section',
      list: null
    };
  },
  computed: {
    sections () {
      return this.$store.getters['entity/items']('section');
    },
    title () {
      let title = '';

      switch (this.$route.name) {
        case 'stories':
          if (this.$route.params.storyType === 'user-story') {
            title = 'user story sections';
          }
          if (this.$route.params.storyType === 'technical-story') {
            title = 'technical story sections';
          }

          this.list = this.sections;
          break;
        case 'dictionary':
          const items = ['Actors', 'API Endpoints', 'Fields', 'Models', 'Other'];

          this.addBtn = '';
          this.list = _.map(items, (item, index) => {
            return {
              name: item,
              id: index
            };
          });


          title = 'dictionary sections';
          break;
      }

      return title;
    }
  },
  methods: {
    addSection () {
      this.$root.$emit('create-new-section');
    },
    goTo (id) {
      this.$router.push({
        name: 'stories',
        params: {
          project: this.$route.params.project,
          section: id,
          tab: this.$route.params.tab
        }
      });
    }
  }
};
</script>
