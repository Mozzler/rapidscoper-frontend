export default {
  methods: {
    hide () {
      this.$root.$emit('hide-hint');
    },
    resetContent () {
      return new Promise(resolve => {
        this.updateText();
        this.event = null;
        [this.previous, this.next] = [null, null];

        this.$refs[this.ref][0].classList.remove('text-greyed');

        resolve();
      });
    },
    parseContent ($event) {
      this.resetContent().then(() => {
        this.event = $event;
        this.setSiblings();

        this.editor.text = this.event.target.innerHTML;

        this.initPlaceholder();

        // show hint, if dictionary has next property
        this.initDictionary();

        // show auto-completion static text
        this.initStaticText();
      });
    },
    initDictionary () {
      let el = this.event.target;

      if (!this.dictionary[this.next] && this.next !== 'beginning') {
        return;
      }

      const nodes = this.event.target.childNodes;
      nodes.filter = [].filter;

      const items = nodes.filter(item => typeof item !== 'function');
      if (!items.length || !this.getSpanList()) {
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

        this.$nextTick(() => {
          this.$root.$emit('set-hint-state', true, this.next, this.filter, this.ref, position);
        });
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
        this.editor.tail = this.createSpan(text, `&nbsp;${type}`, true);
        this.editor.placeholder = this.editor.text + this.editor.tail;
      }
    },
    setSiblings () {
      this.previous = this.getCurrentSpan();
      this.next = this.getNextSpan();
    },
    createField ($event, first = false) {
      $event.preventDefault();
      if ($event.ctrlKey && $event.code === 'Enter' && this.next === 'beginning') {
        return;
      }
      this.$root.$emit('complete-hint', this.filter, first);
      this.filter = null;
    },
    focusHint () {
      this.$root.$emit('focus-hint');
    },
    hintComplete (chapter, text, el) {
      if (el !== this.ref) {
        return;
      }

      this.$nextTick(() => {
        this.$refs[el][0].focus();
      });

      if (chapter === 'beginning') {
        this.editor.template = text.value;
        text = text.key;
      }

      const spans = this.getSpanList();

      this.editor.text = `${spans}${!spans ? '' : '&nbsp;'}${this.createSpan(chapter, text)}`;
      this.editor.tail = '';
      this.editor.placeholder = this.editor.text;
      this.filter = null;

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

      if (!this.getSpanList()) {
        return false;
      }

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
