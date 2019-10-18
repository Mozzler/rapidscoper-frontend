export default {
  data () {
    return {
      focused: null,
      editor: null,
      etalon: null,
      blocked: false,
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
          hint.innerHTML = this.description.text;

          const x = (phraseRect.width - hint.clientWidth) / 2;
          const y = hint.clientHeight;
          _.assign(hint.style, {
            position: 'absolute',
            top: `${phraseRect.top - wysiwygRect.top - 5 - y}px`,
            left: `${phraseRect.left - wysiwygRect.left + x}px`
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
    focusEvent (item, index) {
      this.otherBuffer = '';
      this.focused = index;
      this.etalon = { ...item };
      this.$store.commit('story/setActiveStoryOnTab', this.etalon.id);

      if (this.etalon.id !== this.hintEditor) {
        this.hintEditor = null;
      }
    },
    keydownEvent ($event) {
      this.event = $event;

      if (this.isEditable() || $event.key === 'Escape') {
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
      }
    },
    async keyupEvent ($event) {
      if ($event.key === 'Escape') {
        return;
      }

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
    }
  }
};
