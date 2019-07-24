export default {
  data () {
    return {
      toolId: null
    };
  },
  beforeMount () {
    this.$root.$on('reset-tool-id', this.resetToolId);
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
      _.each(this.list, item => {
        if (item.id === this.toolId) {
          item[this.tab] = propertyId;
        }
      });

      this.$store.dispatch('entity/update', {
        entity: 'story',
        params: {
          id: this.toolId
        },
        data: {
          [this.tab]: propertyId
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
  }
};
