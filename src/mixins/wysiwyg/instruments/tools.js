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
    },
    toolDictionary () {
      return this.$store.state.story[this.tab];
    },
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
      const letters = _.map(this.toolDictionary, item => item.charAt(0).toLowerCase());
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
      }).then(() => {
        this.toolProcessing = false;
      });
    },
    async resetToolId (id) {
      if (this.$refs[`tool-panel-${id}`]) {
        this.toolId = id;
        await this.$nextTick();
        this.$refs[`tool-panel-${id}`][0].focus();
      } else {
        this.toolId = null;
      }
    },
    nextItem () {
      let next = _.indexOf(this.storyOrder, this.toolId);
      next = next + 1 < this.storyOrder.length ? next + 1 : 0;

      this.focusItem(next);
    },
    previousItem () {
      let previous = _.indexOf(this.storyOrder, this.toolId);
      previous = previous - 1 > -1 ? previous - 1 : 0;

      this.focusItem(previous);
    },
    async focusItem (id) {
      this.toolId = null;
      this.$root.$emit('reset-tool-id', this.storyOrder[id]);
    }
  },
  beforeDestroy () {
    this.$root.$off('reset-tool-id', this.resetToolId);
    this.$root.$off('stop-tool-processing', this.stopProcessing);
  }
};
