export default {
  data () {
    return {
      toolStack: {}
    };
  },
  computed: {
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
    handleError (error, property, stack = 'stack') {
      let id = error.config.params.id;
      let msg = error.response && error.response.data && _.first(error.response.data);

      if (msg) {
        this.$root.$emit('show-error-message', msg.message);
      }

      this.$store.commit('entity/update', {
        entity: 'story',
        data: {
          id: id,
          [property]: this[stack][id]
        }
      });

      delete this[stack][id];
    },
    updateToolId (propertyId, item, property) {
      let query = null;
      let id = this.toolId;

      let found = _.find(this.list, item => item.id === id);
      this.toolStack[id] = found[property];

      if (_.isArray(item[property])) {
        query = item[property].includes(propertyId) ?
          item[property].filter(i => i !== propertyId) :
          [...item[property], ...[propertyId]];
      } else {
        query = propertyId;
      }

      this.$store.commit('entity/update', {
        entity: 'story',
        data: {
          id: id,
          [property]: query
        }
      });

      this.nextItem();
      this.$store.dispatch('entity/update', {
        entity: 'story',
        params: {
          id: id
        },
        data: {
          [property]: query
        }
      }).then()
        .catch(error => {
          this.handleError(error, property, 'toolStack');
        });
    }
  }
};
