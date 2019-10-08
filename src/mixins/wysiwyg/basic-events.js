export default {
  data () {
    return {
      focused: null,
      editor: null,
      etalon: null,
      blocked: false,
      otherBuffer: '',
      description: {
        text: '',
        id: null
      }
    };
  },
  methods: {
    hoverEvent ($event, id) {
      const target = $event.target;
      this.description.id = null;
      if (target.dataset.id) {
        const dictionary = _.find(this.rawSections, item => item.id === target.dataset.id);

        if (dictionary && dictionary.description) {
          const hint = document.getElementById(`description-container-${id}`);
          const phraseRect = target.getBoundingClientRect();
          const wysiwygRect = document.getElementById(`wysiwyg-${id}`)
            .getBoundingClientRect();

          this.description = {
            id: id,
            text: dictionary.description
          };

          this.$nextTick();

          _.assign(hint.style, {
            position: 'absolute',
            top: `${phraseRect.top - wysiwygRect.top - 30}px`,
            left: `${phraseRect.left - wysiwygRect.left + this.description.text.length * 1.3}px`
          });
        }
      }
    },
    leaveEvent () {
      this.description = {
        text: '',
        id: null
      };
    },
    withoutSpace () {
      const index = this.otherBuffer.lastIndexOf('&nbsp;');
      let result = this.otherBuffer;

      if (index === this.otherBuffer.length - 6) {
        result = this.otherBuffer.slice(0, index);
      }

      return result;
    },
    async checkOtherDictionary (key, space = false) {
      const corrected = this.withoutSpace(this.otherBuffer);
      const accepted = {
        space: this.otherBuffer && space,
        capitalized: key.match(/[A-Z]/),
        letter: this.otherBuffer && key.match(/[a-z]/) && corrected === this.otherBuffer
      };

      if (_.some(accepted)) {
        this.otherBuffer += key;
        return;
      }

      if (this.otherBuffer) {
        const custom = this.createSpan('other', corrected, false, false, true);
        this.list[this.focused].markup = this.list[this.focused].markup.replace(this.otherBuffer, custom);

        await this.submitField('custom', corrected, this.focused);
        this.otherBuffer = '';
      }
    },
    focusEvent (item, index) {
      this.otherBuffer = '';
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

      if (this.isEditable()) {
        return;
      }

      if (!this.list[this.focused].markup.length &&
        this.shortcutList.includes(this.event.key)) {
        $event.preventDefault();
        return this.completeBeginning(this.event.key);
      }

      let printable = this.printable($event.which);
      if (printable) {
        $event.preventDefault();
        let story = this.list[this.focused];
        let key = $event.key;

        if (key === ' ') {
          story.markup += '&nbsp;';
          this.checkOtherDictionary('&nbsp;', true);
        } else {
          story.markup += key;
          this.checkOtherDictionary(key);
        }

        story.placeholder = story.markup + story.tail;
        this.collapseToEnd();
      }
    },
    async keyupEvent ($event) {
      this.event = $event;
      this.setSiblings();

      let printable = this.printable($event.which);
      if (!printable && !this.isEditable()) {
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
