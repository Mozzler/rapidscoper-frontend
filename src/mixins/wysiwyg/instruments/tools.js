import Processing from './processing';

export default {
  mixins: [
    Processing
  ],
  data () {
    return {
      disabled: false,
      archived: null,
      elRef: {
        estimate: 'estimate',
        labels: 'tool-panel',
        priority: 'tool-panel'
      }
    };
  },
  beforeMount () {
    this.$root.$on('stop-tool-processing', this.stopProcessing);
  },
  mounted () {
    this.initToolId();
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
    initToolId () {
      if (!this.toolId) {
        this.$store.commit('story/setActiveStoryOnTab', this.storyOrder[0]);
        this.activatePanel();
      }
    },
    selectTool (id) {
      const focusedTab = this.$refs[`${this.elRef[this.tab]}-${this.toolId}`];
      if (focusedTab) {
        this.archived = focusedTab[0].value;
      }

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
      this.disabled = true;
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
      const ref = this.$refs[`${this.elRef[this.tab]}-${this.toolId}`];

      if (this.tab === 'edit') {
        this.$nextTick(() => {
          document.getElementById(this.toolId).focus();
          this.collapseToEnd();
        });
      } else {
        if (this.toolId && ref) {
          this.$nextTick(() => {
            ref[0].focus();
          });
        }
      }
    }
  },
  beforeDestroy () {
    this.$root.$off('stop-tool-processing', this.stopProcessing);
  },
  watch: {
    toolId () {
      this.$nextTick(() => {
        this.activatePanel();
      });
    },
    tab () {
      this.$nextTick(() => {
        this.activatePanel();
      });
    },
    toolProcessing (newVal, oldVal) {
      if (newVal === null && oldVal.id === this.toolId && this.tab === 'priority' && this.disabled) {
        this.nextItem();
        this.disabled = false;
      }
    }
  }
};
