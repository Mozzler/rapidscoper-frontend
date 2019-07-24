export default {
  data () {
    return {
      toolId: null
    };
  },
  beforeMount () {
    this.$root.$on('reset-tool-id', this.resetToolId);
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
    }
  },
  beforeDestroy () {
    this.$root.$off('reset-tool-id', this.resetToolId);
  }
};
