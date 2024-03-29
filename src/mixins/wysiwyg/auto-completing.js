export default {
  methods: {
    initDictionary () {
      let el = this.event.target;

      if (!this.dictionary[this.next] && this.next !== 'beginning') {
        return;
      }

      const nodes = this.event.target.childNodes;
      nodes.filter = [].filter;

      const items = nodes.filter(item => typeof item !== 'function');

      if (!items.length || !this.getSpanList()) {
        el = this.$refs[this.list[this.focused].id][0];
      } else {
        if (!this.previous) {
          return;
        }

        let filtered = nodes.filter(item => {
          let previous = this.previous.split('=')[0];
          return item.className && item.className.includes(previous);
        });

        el = filtered[0];
      }

      if (el) {
        this.filter = '';

        const texts = nodes.filter(item => !item.className && !!item.data.trim());
        if (texts && texts.length) {
          this.filter = texts[texts.length - 1].textContent.trim();
        }

        this.showHint(el, this.next);
      }
    },
    initPlaceholder () {
      const [line, tail] = this.getLineParticles();
      const text = this.dictionary.placeholders[this.next];

      if (!tail && text) {
        this.list[this.focused].tail = this.createSpan(this.next, `&nbsp;${text}`, true, false);
        this.list[this.focused].placeholder = line + this.list[this.focused].tail;
      } else {
        this.resetPlaceholder();
      }
    },
    initStaticText () {
      let completion = null;

      if (!this.next) {
        return;
      }

      if (this.next.includes('static-text')) {
        completion = this.getStaticText(0);
      }
      if (this.next.includes('custom')) {
        completion = this.getStaticText(1);
      }

      if (completion !== null) {
        const [text, type] = this.getStaticTextByType(completion);
        this.list[this.focused].tail = this.createSpan(text, `&nbsp;${type}`, true);
        this.list[this.focused].placeholder = this.list[this.focused].markup + this.list[this.focused].tail;
      }
    },
    setSiblings () {
      this.previous = this.getCurrentSpan();
      this.next = this.getNextSpan();
    },
    createField ($event, first = false) {
      $event.preventDefault();
      if ($event.code === 'Enter' && this.next === 'beginning') {
        return;
      }

      this.$root.$emit('complete-hint', this.filter, first, this.next === 'beginning', this.list[this.focused].id);
      this.filter = null;
    },
    setCompletion () {
      this.next = this.getStaticText();

      if (this.next && this.next.includes('static-text')) {
        const [type, text] = this.getStaticTextByType();
        this.list[this.focused].markup += this.createSpan(type, text, false);
      }
    },
    finishSentence ($event, character = '') {
      $event.preventDefault();

      if (!this.getSpanList()) {
        return false;
      }

      this.event = $event;
      this.list[this.focused].markup = this.list[this.focused].markup + character;

      this.setSiblings();
      this.setCustomText(true);

      this.resetPlaceholder();
      this.collapseToEnd();
    },
    setCustomText (editable = false) {
      const [list, tail] = this.getLineParticles();

      if (tail) {
        const text = this.createSpan(this.next, `&nbsp;${tail}`, false, editable);
        this.list[this.focused].markup = list + (this.next ? text : ':');
      }
    }
  }
};
