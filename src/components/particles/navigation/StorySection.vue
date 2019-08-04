<template>
  <div class="sidebar story-section pt-4">
    <sidebar-list
      :reorder="content.reorder"
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
      return this.$store.getters['story/orderedSections'](this.projectId);
    },
    dictionarySections () {
      return this.$store.getters['dictionary/sections'];
    },
    projects () {
      return this.$store.getters['entity/items']('project');
    },
    project () {
      return _.find(this.projects, item => item.id === this.projectId);
    },
    projectId () {
      return this.$route.params.projectId;
    },
    content () {
      let data = {
        title: '',
        indicator: 'id',
        addBtn: 'Add Section',
        reorder: null
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
          data.reorder = this.reorder;
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
    reorder ($event, cb) {
      const moved = $event.moved;
      const sectionOrder = this.project.sectionOrder;
      [sectionOrder[moved.newIndex], sectionOrder[moved.oldIndex]] =
        [sectionOrder[moved.oldIndex], sectionOrder[moved.newIndex]];

      const data = {
        entity: 'project',
        params: {
          id: this.projectId
        },
        data: {
          id: this.projectId,
          sectionOrder: sectionOrder
        }
      };

      this.$store.dispatch('entity/update', data)
        .then(() => {
          cb(this.storySections);
        });
    },
    addSection () {
      this.$root.$emit('create-new-section');
    },
    getParams (id) {
      switch (this.$route.name) {
        case 'stories':
          return {
            projectId: this.projectId,
            storyType: this.$route.params.storyType,
            section: id,
            tab: this.$route.params.tab
          };
        case 'dictionary':
          return {
            projectId: this.projectId,
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
