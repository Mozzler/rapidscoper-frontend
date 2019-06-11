export default {
  computed: {
    dictionary () {
      return this.$store.state.story.dictionary;
    }
  },
  methods: {
    hintComplete (chapter, text, el) {
      if (this.$refs[el]) {
        this.$refs[el][0].focus();

        const editor = this.list[this.focused];

        editor.text = editor.text
          .split('</span>')
          .filter(item => item.includes('<span'))
          .map(item => `${item}</span>`)
          .join();

        editor.text += this.setStaticText(chapter, text);
        editor.tail = '';
        editor.placeholder = editor.text + editor.tail;

        this.updateText();
      }
    },
    setStaticText(type, text, greyed = false, editable = true) {
      return `<span class="user-story__editable--${type}${greyed ? ' text-greyed' : ''}" contenteditable="${editable}">${text}</span>&nbsp;`;
    },
    classToType(str) {
      return str
        .split(' ')
        .map(item => item.replace('user-story__editable--', ''))[0];
    },
    validateFocus ($event, editor) {
      const selection = $event.view.getSelection();
      let current = selection.focusNode.parentNode.className;

      if (current === 'user-story__editable') {
        current = selection.anchorNode.previousSibling.className;
        //this.removeSpaces();

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
    parseContent ($event) {
      const [editor, current, next] = this.getSiblings($event);

      if (current === 'beginning') {
        editor.text = editor.text.replace(' text-greyed', '');
      }

      editor.text = $event.target.innerHTML;

      this.initPlaceholder($event, editor, next);

      if (this.dictionary[next]) {
        const input = `editor-${this.focused}-${this.level}`;
        this.$root.$emit('set-hint-state', true, next, '', input);
      }
    },
    initPlaceholder ($event, editor, next) {
      let tail = '';

      if (this.dictionary.placeholders[next]) {
        tail = this.dictionary.placeholders[next];
      }
      if (next.includes('static-text')) {
        tail = next.replace(/static-text=|"/g, '');
      }

      if (tail) {
        editor.tail = this.setStaticText('static-text', ` ${tail}`, true, false);
      } else {
        tail = '';
      }

      editor.placeholder = editor.text + editor.tail;
      this.updateText();
    },
    fixStaticText ($event) {
      $event.preventDefault();

      const [editor, current, next] = this.getSiblings($event);
      if (editor.tail && next.includes('static-text')) {
        const content = next.replace(/static-text=|"/g, '');
        editor.text += this.setStaticText('static-text', content, false, false);
        editor.tail = '';
        editor.placeholder = editor.text;
      }
    }
  }
};
