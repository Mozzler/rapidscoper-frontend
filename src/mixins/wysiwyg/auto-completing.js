export default {
  beforeMount () {
    this.$root.$on('set-focus-to-input', this.focusInputFromHint);
  },
  beforeDestroy () {
    this.$root.$off('set-focus-to-input');
  },
  computed: {
    dictionary () {
      return this.$store.state.story.dictionary;
    }
  },
  methods: {
    focusInputFromHint (el) {
      if (this.$refs[el]) {
        this.$nextTick(() => {
          this.$refs[el][0].focus();
        });
      }
    },
    createField ($event) {
      $event.preventDefault();
      this.$root.$emit('complete-hint');
    },
    hintComplete (chapter, text, el) {
      if (this.$refs[el]) {
        this.$nextTick(() => {
          this.$refs[el][0].focus();
        });

        const editor = this.list[this.focused];

        editor.text = editor.text
          .split('</span>')
          .filter(item => item.includes('<span'))
          .map(item => `${item}</span>`)
          .join('');

        editor.text += '&nbsp;' + this.setStaticText(chapter, text);
        editor.tail = '';
        editor.placeholder = editor.text + editor.tail;

        this.updateText();
      }
    },
    setStaticText (type, text, greyed = false, editable = true) {
      const content = `<span 
        class="user-story__editable--${type}${greyed ? ' text-greyed' : ''}" 
        readonly
        contenteditable="false">
            ${text}
        </span>&nbsp;`;
      return content;
    },
    classToType (str) {
      return str
        .split(' ')
        .map(item => item.replace('user-story__editable--', ''))[0];
    },
    validateFocus ($event, editor) {
      const selection = $event.view.getSelection();
      let current = selection.focusNode.parentNode.className;

      if (current === 'user-story__editable') {
        current = selection.anchorNode.previousSibling.className;

        if (current.includes('beginning')) {
          editor.text = editor.text.replace(/ text-greyed/, '');
        }
      }

      return this.classToType(current);
    },
    getNextSpan (current, editor) {
      const parts = editor.template
        .split(/[[(.*)\]]/)
        .filter(item => !!item.trim());

      if (current === 'static-text') {
        const html = document.getSelection().focusNode.previousSibling.innerHTML;
        current += `="${html}"`;
      }

      const next = parts.indexOf(current) + 1;
      return parts[next];
    },
    getSiblings ($event) {
      const editor = this.list[this.focused];
      const current = this.validateFocus($event, editor);
      const next = this.getNextSpan(current, editor);

      return [editor, current, next];
    },
    checkDictionary ($event, focus = false) {
      const [editor, current, next] = this.getSiblings($event);

      if (this.dictionary[next]) {
        const input = `editor-${this.focused}-${this.level}`;

        const nodes = $event.target.childNodes;
        nodes.filter = [].filter;

        const el = nodes.filter(item => item.className && item.className.includes(current))[0];

        if (el) {
          const rect = el.getBoundingClientRect();

          let position = {
            top: rect.top,
            left: el.offsetWidth
          };

          const texts = nodes.filter(item => !item.className);
          this.filter = '';
          if (texts && texts.length) {
            this.filter = texts[0].textContent.trim();
          }
          this.chapter = next;

          this.$root.$emit('set-hint-state', true, next, this.filter, input, position, focus);
        }
      }
    },
    parseContent ($event, focusHint) {
      const [editor, current, next] = this.getSiblings($event);

      if (current === 'beginning') {
        editor.text = editor.text.replace(' text-greyed', '');
      }

      editor.text = $event.target.innerHTML;

      if ($event.key !== '.' && editor.text.trim().charAt(editor.text.length - 1) !== '.') {
        this.initPlaceholder($event, editor, next);
      } else {
        editor.tail = '';
        editor.placeholder = '';
      }

      this.checkDictionary($event, focusHint);
    },
    initPlaceholder ($event, editor, next) {
      let tail = '';
      let innerText = $event.target.innerText.trim();
      let lastCharacter = innerText.charAt(innerText.length - 1);

      if (lastCharacter === '.' || lastCharacter === ':') {
        return;
      }

      if (this.dictionary.placeholders[next]) {
        tail = this.dictionary.placeholders[next];
      }
      if (next.includes('static-text')) {
        tail = next.replace(/static-text=|"/g, '');
      }
      if (next === 'custom') {
        tail = this.$store.state.story.custom[0];
      }

      if (tail) {
        editor.tail = this.setStaticText('static-text', ` ${tail}`, true, false);
      } else {
        tail = '';
      }

      const empty = !editor.text
        .split('</span>')
        .filter(item => !item.includes('<span'))
        .join()
        .replace('&nbsp;', '');

      if (!empty) {
        editor.tail = '';
      }

      editor.placeholder = editor.text + editor.tail;
      this.updateText();
    },
    fixStaticText ($event) {
      $event.preventDefault();
      const [editor, current, next] = this.getSiblings($event);

      if (this.filter) {
        this.$root.$emit('complete-hint', this.filter, true);
        return;
      }

      if (editor.tail && next.includes('static-text')) {
        const content = next.replace(/static-text=|"/g, '');
        editor.text += this.setStaticText('static-text', content, false, false);
        editor.tail = '';
        editor.placeholder = editor.text;
      }

      if (next === 'custom') {
        const tail = editor.text
          .split('</span>')
          .filter(item => !item.includes('<span'))
          .join('');

        const origin = editor.text.split(tail)[0];
        editor.text = origin + this.setStaticText('custom', tail, false, true);
      }
    }
  }
};
