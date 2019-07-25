export default {
  data () {
    return {
      toolId: null,
      toolProcessing: false
    };
  },
  beforeMount () {
    this.$root.$on('reset-tool-id', this.resetToolId);
    this.$root.$on('stop-tool-processing', this.stopProcessing);
  },
  computed: {
    storyOrder () {
      return _.chain(this.$store.getters['entity/items']('section'))
        .map(item => item.storyOrder)
        .flatten()
        .value();
    }
  },
  methods: {
    stopProcessing (id) {
      if (id === this.toolId) {
        this.toolProcessing = false;

        if (this.tab === 'priority') {
          this.nextItem();
        }
      }
    },
    selectTool (id) {
      this.toolId = id;
      this.$root.$emit('reset-tool-id', id);
    },
    toolKey ($event) {
      const letters = _.map(this.collection, item => item.charAt(0).toLowerCase());
      let found = _.indexOf(letters, $event.key);

      if (found !== -1) {
        this.updateToolId(found);
      }
    },
    updateToolId (propertyId) {
      if (this.toolProcessing) {
        return;
      }

      this.toolProcessing = true;
      const item = this.list.find(item => item.id === this.toolId);
      let query = null;

      if (_.isArray(item[this.tab])) {
        query = item[this.tab].includes(propertyId) ?
          item[this.tab].filter(i => i !== propertyId) :
          [...item[this.tab], ...[propertyId]];
      } else {
        query = propertyId;
      }

      this.$store.dispatch('entity/update', {
        entity: 'story',
        params: {
          id: this.toolId
        },
        data: {
          [this.tab]: query
        }
      });
    },
    resetToolId (id) {
      if (this.toolId !== id) {
        this.toolId = null;
      }
    },
    nextItem () {
      let next = _.indexOf(this.storyOrder, this.toolId);
      next = next + 1 < this.storyOrder.length ? next : 0;

      //this.$root.$emit('reset-tool-id', this.storyOrder[next + 1]);
    },
    previousItem () {
      console.log('previous-item');
    }
  },
  beforeDestroy () {
    this.$root.$off('reset-tool-id', this.resetToolId);
    this.$root.$off('stop-tool-processing', this.stopProcessing);
  }
};
