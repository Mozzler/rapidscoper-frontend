import Processing from './processing';

export default {
  mixins: [
    Processing
  ],
  beforeMount () {
    this.$root.$on('' +
      'stop-tool-processing', this.stopProcessing);
    this.activatePanel();
  },
  computed: {
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
    selectTool (id) {
      this.$store.commit('story/setActiveStoryOnTab', id);
    },
    toolKey ($event) {
      const letters = _.map(this.toolDictionary, item => item.charAt(0).toLowerCase());
      let found = _.indexOf(letters, $event.key);

      if (found !== -1) {
        this.submitTool(found);
      }
    },
    submitTool (propertyId) {
      const item = this.list.find(item => item.id === this.toolId);
      this.updateToolId(propertyId, item, this.tab);
    },
    nextItem () {
      let next = _.indexOf(this.storyOrder, this.toolId);
      next = next + 1 < this.storyOrder.length ? next + 1 : 0;

      this.selectTool(this.storyOrder[next]);
    },
    previousItem () {
      let previous = _.indexOf(this.storyOrder, this.toolId);
      previous = previous - 1 > -1 ? previous - 1 : this.storyOrder.length - 1;

      this.selectTool(this.storyOrder[previous]);
    },
    activatePanel () {
      if (this.toolId) {
        const ref = this.$refs[`tool-panel-${this.toolId}`];
        if (ref) {
          ref[0].focus();
        }
      } else {
        this.selectTool(this.storyOrder[0]);
      }
    }
  },
  beforeDestroy () {
    this.$root.$off('stop-tool-processing', this.stopProcessing);
  },
  watch: {
    toolId () {
      this.activatePanel();
    },
    tab () {
      this.activatePanel();
    },
    watch: {
      toolProcessing (newVal, oldVal) {
        if (newVal === null && oldVal === this.toolId && this.tab === 'priority') {
          this.nextItem();
        }
      }
    }
  }
};
