export default {
  computed: {
    toolProcessing () {
      return this.$store.state.story.toolProcessing;
    },
    toolId () {
      return this.$store.state.story.activeStoryOnTab;
    },
    tab () {
      let modifiable = ['estimates', 'priorities'];
      let tab = this.$route.params.tab;

      if (modifiable.includes(tab)) {
        tab = tab.slice(0, -1);

        if (tab.slice(-2) === 'ie') {
          tab = `${tab.slice(0, -2)}y`;
        }
      }

      return tab;
    }
  },
  methods: {
    updateToolId (propertyId, item, property) {
      if (this.toolProcessing) {
        return;
      }

      this.$store.commit('story/setToolProcessing', {
        type: property,
        id: this.toolId
      });
      let query = null;

      if (_.isArray(item[property])) {
        query = item[property].includes(propertyId) ?
          item[property].filter(i => i !== propertyId) :
          [...item[property], ...[propertyId]];
      } else {
        query = propertyId;
      }

      this.$store.dispatch('entity/update', {
        entity: 'story',
        params: {
          id: this.toolId
        },
        data: {
          [property]: query
        }
      });
    }
  }
};
