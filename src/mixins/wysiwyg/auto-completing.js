export default {
  methods: {
    hide () {
      this.$root.$emit('hide-hint');
    },
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

        this.$refs[this.ref][0].classList.remove('text-greyed');
      });
    },
    initDictionary () {
      let el = this.event.target;

      if (!this.dictionary[this.next] && this.next !== 'beginning') {
        return;
      }

      const nodes = this.event.target.childNodes;
      nodes.filter = [].filter;

      if (!nodes.length) {
        el = this.$refs[this.ref][0];
      } else {
        let filtered = nodes.filter(item => {
          let previous = this.previous.split('=')[0];
          return item.className && item.className.includes(previous);
        });

        el = filtered[0];
      }

      if (el) {
        const rect = el.getBoundingClientRect();
        const texts = nodes.filter(item => !item.className && !!item.data.trim());
        const position = {
          top: rect.top + 20,
          left: rect.left + 24
        };

        this.filter = '';

        if (texts && texts.length) {
          this.filter = texts[texts.length - 1].textContent.trim();
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
        this.resetPlaceholder();
      }
    },
    initStaticText () {
      let completion = null;

      if (this.next) {
        if (this.next.includes('static-text')) {
          completion = this.getStaticText(0);
        }
        if (this.next === 'custom') {
          completion = this.getStaticText(1);
        }

        if (completion !== null) {
          const [text, type] = this.getStaticTextByType(completion);
          this.editor.tail = this.createSpan(text, `&nbsp;${type}`, true);
          this.editor.placeholder = this.editor.text + this.editor.tail;
        }
      }
    },
    setSiblings () {
      this.previous = this.getCurrentSpan();
      this.next = this.getNextSpan();
    },
    focusInputFromHint (el) {
      /*if (this.$refs[el]) {
        this.$nextTick(() => {
          this.$refs[el][0].focus();
        });
        return true;
      }
      return false;*/
    },
    createField ($event) {
      $event.preventDefault();
      this.$root.$emit('complete-hint');
      this.filter = null;
    },
    hintComplete (chapter, text, el) {
      if (el !== this.ref) {
        return;
      }

      if (chapter === 'beginning') {
        this.editor.template = text.value;
        text = text.key;
      }

      this.editor.text = this.getSpanList() + '&nbsp;' + this.createSpan(chapter, text);
      this.editor.tail = '';
      this.editor.placeholder = this.editor.text;

      this.setCompletion();
      this.updateText();
    },
    setCompletion () {
      this.next = this.getStaticText();

      if (this.next && this.next.includes('static-text')) {
        const [type, text] = this.getStaticTextByType();
        this.editor.text += this.createSpan(type, text, false);
      }
    },
    finishSentence ($event, character = '') {
      $event.preventDefault();

      this.event = $event;
      this.editor.text = (`${this.editor.text}${character}`);

      this.setSiblings();
      this.setCustomText();

      this.resetPlaceholder();
      this.updateText();
    },
    setCustomText () {
      const [list, tail] = this.getLineParticles();

      if (tail) {
        const text = this.createSpan(this.next, `&nbsp;${tail}`, false, false);
        this.editor.text = list + text;
      }
    }
  }
};
