export default {
  data () {
    return {
      focused: null,
      editor: null,
      etalon: null
    };
  },
  methods: {
    focusEvent (item, index) {
      this.focused = index;
      this.etalon = { ...item };
      this.hintEditor = null;
      this.$store.commit('story/setActiveEditorId', this.etalon.id);
    },
    keyupEvent ($event) {
      this.event = $event;
      this.setSiblings();

      if (this.isEditable()) {
        return;
      }

      if (!this.list[this.focused].markup.length && this.shortcutList.includes(this.event.key)) {
        $event.preventDefault();
        return this.completeBeginning(this.event.key);
      }

      this.list[this.focused].markup = this.event.target.innerHTML;
      this.$refs[this.list[this.focused].id][0].classList.remove('text-greyed');
      this.collapseToEnd();

      this.initPlaceholder();
      this.initDictionary();
      this.initStaticText();
    },
    isEditable () {
      if (!this.event) {
        return false;
      }

      const focused = this.event.view.getSelection().focusNode;
      const node = focused ? this.event.view.getSelection().focusNode.parentElement : null;
      return node && node.className.includes('custom');
    },
    completeBeginning (shortcut) {
      const item = _.find(this.adjustedConstruction, item => item.shortcut === shortcut);
      this.hintEditor = this.list[this.focused].id;
      this.hintComplete('beginning', item, this.list[this.focused].id);
    }
  }
};
