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
    keydownEvent ($event) {
      this.event = $event;

      if (this.isEditable()) {
        return;
      }

      if (!this.list[this.focused].markup.length &&
        this.shortcutList.includes(this.event.key)) {
        $event.preventDefault();
        return this.completeBeginning(this.event.key);
      }

      if (this.event.code.includes('Digit') ||
        this.event.code.includes('Key') ||
        this.event.code.includes('Space')) {

        $event.preventDefault();
        this.blocked = true;

        if (this.event.code.includes('Space')) {
          this.list[this.focused].markup += '&nbsp;';
        } else {
          this.list[this.focused].markup += this.event.key;
        }
        $event.target.innerHTML = this.list[this.focused].markup;
      }
    },
    async keyupEvent ($event) {
      this.event = $event;
      this.setSiblings();

      if (!this.blocked) {
        this.list[this.focused].markup = this.event.target.innerHTML;
      } else {
        this.blocked = false;
      }

      this.$refs[this.list[this.focused].id][0].classList.remove('text-dark-grey');
      this.collapseToEnd();

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
