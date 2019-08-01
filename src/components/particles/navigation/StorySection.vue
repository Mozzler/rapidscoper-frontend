<template>
  <div class="sidebar story-section pt-4">
    <sidebar-list
      :title="content.title"
      :btn="content.addBtn"
      :list="content.list"
      :indicator="content.indicator"
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
      list: null
    };
  },
  computed: {
    sections () {
      return this.$store.getters['entity/items']('section');
    },
    content () {
      let data = {
        title: '',
        indicator: 'id'
      };

      switch (this.$route.name) {
        case 'stories': {
          if (this.$route.params.storyType === 'user-story') {
            data.title = 'user story sections';
          }
          if (this.$route.params.storyType === 'technical-story') {
            data.title = 'technical story sections';
          }
          data.list = this.sections;

          break;
        }
        case 'dictionary': {
          const items = ['Actors', 'API Endpoints', 'Fields', 'Models', 'Other'];

          data.addBtn = '';
          data.title = 'dictionary sections';
          data.indicator = 'name';
          data.list = _.map(items, (item, index) => {
            return {
              name: item,
              id: index
            };
          });

          break;
        }
      }

      return data;
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
