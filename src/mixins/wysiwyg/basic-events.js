export default {
  data () {
    return {
      focused: null,
      editor: null
    };
  },
  methods: {
    focusEvent (item, index) {
      this.focused = index;
      this.editor = item;
    },
    keyupEvent ($event) {
      this.event = $event;
      this.setSiblings();

      if (this.isEditable()) {
        return;
      }

      if (!['Backspace', 'Delete'].includes($event.key)) {
        if (!this.editor.markup.length && this.shortcutList.includes(this.event.key)) {
          $event.preventDefault();
          return this.completeBeginning(this.event.key);
        }

        this.editor.markup = this.event.target.innerHTML;
        this.$refs[this.editor.id][0].classList.remove('text-greyed');
        this.collapseToEnd();

        this.initPlaceholder();
        this.initDictionary();
        this.initStaticText();
      }
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
      this.hintEditor = this.editor.id;
      this.hintComplete('beginning', item, this.editor.id);
    }
  }
};
