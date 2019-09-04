import Processing from './processing';
import { mapGetters } from 'vuex';

export default {
  mixins: [
    Processing
  ],
  data () {
    return {
      range: null,
      disabled: false,
      archived: null,
      elRef: {
        estimate: 'estimate',
        labels: 'tool-panel',
        priority: 'tool-panel'
      }
    };
  },
  mounted () {
    this.initToolId();
  },
  computed: {
    ...mapGetters({
      labelsTool: 'story/labels'
    }),
    priorityTool () {
      return this.$store.state.story.priority;
    },
    toolDictionary () {
      return this[`${this.tab}Tool`];
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
      if (focusedTab && focusedTab.length) {
        this.archived = focusedTab[0].value;

        if (this.tab === 'estimate') {
          let length = focusedTab[0].value.length;
          focusedTab[0].setSelectionRange(0, length);
          this.range = length;
        }
      }

      this.$store.commit('story/setActiveStoryOnTab', id);
    },
    toolKey ($event) {
      const letters = _.map(this.toolDictionary, (item, index) => {
        if (_.isObject(item)) {
          return (index + 1).toString();
        } else {
          return item.charAt(0).toLowerCase();
        }
      });

      let found = _.indexOf(letters, $event.key);
      if (found !== -1) {
        this.submitTool(found);
      }
    },
    submitTool (propertyId) {
      const item = this.list.find(item => item.id === this.toolId);
      if (item.priority === propertyId) {
        propertyId = -1;
      }

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

      if (this.tab === 'edit' && this.focused) {
        this.$nextTick(() => {
          const el = document.getElementById(this.toolId);
          if (el) {
            el.focus();
          }

          const selection = document.getSelection();

          if (selection.anchorNode === null || !document.getSelection.toString.length) {
            return;
          } else if (selection.anchorNode.id) {
            this.collapseToEnd();
          } else {
            const range = document.createRange();
            range.setStart(selection.anchorNode, selection.anchorOffset);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        });
      } else {
        if (this.toolId && ref && ref[0]) {
          this.$nextTick(() => {
            ref[0].focus();

            if (this.tab === 'estimate' && this.range) {
              ref[0].setSelectionRange(0, this.range);
            }
          });
        }
      }
    }
  },
  updated () {
    console.log('updated');
    if (this.hintEditor === null && this.movable === null) {
      this.activatePanel();
    }
  },
  watch: {
    toolId () {
      this.$nextTick(() => {
        this.activatePanel();
      });
    }
  }
};
