export default {
  data () {
    return {
      toolProcessing: false
    };
  },
  beforeMount () {
    this.$root.$on('stop-tool-processing', this.stopProcessing);
    this.activatePanel();
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
    },
    toolId () {
      return this.$store.state.story.activeStoryOnTab;
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
      if (this.tab !== 'edit') {
        this.$store.commit('story/setActiveStoryOnTab', id);
      }
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

        if (this.tab === 'priority') {
          this.nextItem();
        }
      });
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
    }
  }
};
