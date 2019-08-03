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
    storySections () {
      return this.$store.getters['entity/items']('section');
    },
    dictionarySections () {
      return this.$store.getters['dictionary/sections'];
    },
    content () {
      let data = {
        title: '',
        indicator: 'id',
        addBtn: 'Add Section'
      };

      switch (this.$route.name) {
        case 'stories': {
          if (this.$route.params.storyType === 'user-story') {
            data.title = 'user story sections';
          }
          if (this.$route.params.storyType === 'technical-story') {
            data.title = 'technical story sections';
          }
          data.list = this.storySections;

          break;
        }
        case 'dictionary': {
          data.addBtn = '';
          data.title = 'dictionary sections';
          data.list = this.dictionarySections;

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
    getParams (id) {
      switch (this.$route.name) {
        case 'stories':
          return {
            projectId: this.$route.params.projectId,
            storyType: this.$route.params.storyType,
            section: id,
            tab: this.$route.params.tab
          };
        case 'dictionary':
          return {
            projectId: this.$route.params.projectId,
            section: id
          };
      }
    },
    goTo (id) {
      this.$router.replace({
        name: this.$route.name,
        params: this.getParams(id)
      });
    }
  }
};
</script>
