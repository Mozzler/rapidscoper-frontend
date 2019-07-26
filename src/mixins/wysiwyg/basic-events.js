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
      this.editor.markup = this.event.target.innerHTML;
      this.$refs[this.editor.id][0].classList.remove('text-greyed');

      this.collapseToEnd();

      if (this.isEditable()) {
        return;
      }
      this.setSiblings();

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
    }
  }
};
