export default {
  data () {
    return {
      focused: null,
      editor: null,
      etalon: null,
      blocked: false
    };
  },
  methods: {
    focusEvent (item, index) {
      this.focused = index;
      this.etalon = { ...item };
      this.$store.commit('story/setActiveStoryOnTab', this.etalon.id);

      if (this.etalon.id !== this.hintEditor) {
        this.hintEditor = null;
      }
    },
    printable (keycode) {
      return (keycode > 47 && keycode < 58) || // number keys
      (keycode === 32 || keycode === 13) || // spacebar & return key(s)
      (keycode > 64 && keycode < 91) || // letter keys
      (keycode > 95 && keycode < 112) || // numpad keys
      (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
      (keycode > 218 && keycode < 223);
    },
    keydownEvent ($event) {
      this.event = $event;

      let printable = this.printable($event.which);
      if (printable) {
        $event.preventDefault();
        let story = this.list[this.focused];
        let key = $event.key;

        if (key === ' ') {
          story.markup += '&nbsp;';
        } else {
          story.markup += key;
        }

        story.placeholder = story.markup + story.tail;
        this.collapseToEnd();
      }
    },
    async keyupEvent ($event) {
      this.list[this.focused].markup = this.event.target.innerHTML;

      this.event = $event;
      this.setSiblings();

      if (!this.blocked) {
        this.list[this.focused].markup = this.event.target.innerHTML;
      } else {
        this.blocked = false;
      }

      this.$refs[this.list[this.focused].id][0].classList.remove('text-dark-grey');
      this.collapseToEnd();
      let printable = this.printable($event.which);
      if (!printable) {
        this.list[this.focused].markup = this.event.target.innerHTML;
        this.collapseToEnd();
      }

      this.$refs[this.list[this.focused].id][0].classList.remove('text-dark-grey');

      this.initPlaceholder();
      this.initDictionary();
      this.initStaticText();

      this.$store.commit('entity/update', {
        entity: 'story',
        data: this.list[this.focused]
      });
    },
    isEditable () {
      if (!this.event) {
        return false;
      }

      const focused = this.event.view.getSelection().focusNode;
      const node = focused ? this.event.view.getSelection().focusNode.parentElement : null;
      const other = this.list[this.focused] && this.list[this.focused].type === 'other';

      if (other) {
        this.list[this.focused].placeholder = this.event.target.innerHTML;
      }

      return (node && node.className.includes('custom')) || other;
    },
    completeBeginning (shortcut) {
      const item = _.find(this.adjustedConstruction, item => item.shortcut === shortcut);
      this.hintEditor = this.list[this.focused].id;
      this.hintComplete('beginning', item, this.list[this.focused].id);
    }
  }
};
