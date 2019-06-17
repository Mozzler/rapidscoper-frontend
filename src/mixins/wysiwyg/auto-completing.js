export default {
  methods: {
    parseContent ($event) {
      new Promise(resolve => {
        this.event = $event;
        this.setSiblings();

        this.editor.text = this.event.target.innerHTML;

        this.initPlaceholder();

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
    initPlaceholder () {
      const [line, tail] = this.getLineParticles();
      const text = this.dictionary.placeholders[this.next];

      if (!tail && text) {
        this.editor.tail = this.createSpan(this.next, `&nbsp;${text}`, true, false);
        this.editor.placeholder = line + this.editor.tail;
      } else {
        this.editor.tail = '';
        this.editor.placeholder = this.editor.text;
      }
    },
    initStaticText () {
      /*
      if (this.next === 'custom') {
        this.resetPlaceholder();
        return;
      }

      const completion = this.getStaticText();

      if (completion !== null) {
        const [text, type] = this.getStaticTextByType(completion);
        this.editor.tail = this.createSpan(text, type, true);
        this.editor.placeholder = this.editor.text + this.editor.tail;
      }*/
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
    finishSentence ($event, character = '') {
      $event.preventDefault();

      if (this.editor.text.indexOf(character) !== -1) {
        return;
      }

      this.event = $event;
      this.editor.text = (`${this.editor.text}${character}`);

      this.setSiblings();
      this.setCustomText();

      this.resetPlaceholder();
      this.updateText();
    },
    setCustomText () {
      const origin = this.getSpanList();
      const tail = this.getTail();

      if (tail) {
        this.editor.text = origin + this.createSpan(this.next, `&nbsp;${tail}`, false, false);
      }
    }
  }
};
