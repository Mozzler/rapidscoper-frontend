export default {
  data () {
    return {
      event: null,
      previous: null,
      next: null
    };
  },
  beforeMount () {
    this.$root.$on('set-focus-to-input', this.focusInputFromHint);
    this.$root.$on('hint-complete', this.hintComplete);
  },
  beforeDestroy () {
    this.$root.$off('set-focus-to-input');
    this.$root.$off('hint-complete');
  },
  computed: {
    dictionary () {
      return this.$store.state.story.dictionary;
    },
    editor () {
      return this.focused !== null ? this.list[this.focused] : null;
    },
    ref () {
      return `editor-${this.focused}-${this.level}`;
    }
  },
  methods: {
    parseContent ($event) {
      new Promise(resolve => {
        this.event = $event;
        this.setSiblings();

        this.editor.text = this.event.target.innerHTML;

        // show hint, if dictionary has next property
        this.initDictionary();

        // show auto-completion static text
        this.initStaticText();

        resolve();
      }).then(() => {
        this.updateText();
        this.event = null;
        [this.previous, this.next] = [null, null];
      });
    },
    initDictionary () {
      if (!this.dictionary[this.next]) {
        return;
      }

      const nodes = this.event.target.childNodes;
      nodes.filter = [].filter;

      const el = nodes.filter(item => item.className && item.className.includes(this.previous))[0];

      if (el) {
        const rect = el.getBoundingClientRect();
        const texts = nodes.filter(item => !item.className);
        const position = {
          top: rect.top,
          left: el.offsetWidth
        };

        this.filter = '';
        if (texts && texts.length) {
          this.filter = texts[0].textContent.trim();
        }

        this.$root.$emit('set-hint-state', true, this.next, this.filter, this.ref, position);
      }
    },
    initStaticText () {
      if (!this.next === 'custom') {
        return;
      }

      const completion = this.getStaticText();

      if (completion !== null) {
        const [text, type] = this.getStaticTextByType(completion);
        this.editor.tail = this.createSpan(text, type, true);
        this.editor.placeholder = this.editor.text + this.editor.tail;
      }
    },
    setSiblings () {
      this.previous = this.getCurrentSpan();
      this.next = this.getNextSpan();
    },
    focusInputFromHint (el) {
      if (this.$refs[el]) {
        this.$nextTick(() => {
          this.$refs[el][0].focus();
        });
        return true;
      }
      return false;
    },
    createField ($event) {
      $event.preventDefault();
      this.$root.$emit('complete-hint');
    },
    hintComplete (chapter, text, el) {
      if (!this.focusInputFromHint(el)) {
        return;
      }

      this.editor.text = this.getSpanList() + '&nbsp;' + this.createSpan(chapter, text);
      this.editor.tail = '';
      this.editor.placeholder = `&nbsp;${this.editor.text}`;

      this.setCompletion();
      this.updateText();
    },
    setCompletion () {
      this.next = this.getStaticText();

      if (this.next.includes('static-text')) {
        const [type, text] = this.getStaticTextByType(this.next);
        this.editor.text += this.createSpan(type, text, false);
      }
    },
    finishSentence ($event) {
      this.event = $event;
      this.setSiblings();
      this.setCustomText();
    },
    setCustomText () {
      const origin = this.getSpanList();
      const tail = this.getTail();

      if (tail) {
        this.editor.text = origin + this.createSpan(this.next, `&nbsp;${tail}`, false, false);
        this.resetPlaceholder();
        this.updateText();
      }
    }
  }
};
