export default {
  computed: {
    dictionary () {
      return this.$store.state.story.dictionary;
    }
  },
  methods: {
    hintComplete(chapter, text, el) {
      if (this.$refs[el]) {
        this.$refs[el][0].focus();
        this.list[this.focused].text += this.setStaticText(chapter, text);

        this.updateText();
      }
    },
    setStaticText(type, text, greyed = false, editable = true) {
      return `<span class="user-story__editable--${type}${greyed ? ' text-greyed' : ''}" contenteditable="${editable}">${text}</span>&nbsp;`;
    },
    removeSpaces() {
      const editor = this.list[this.focused];

      editor.text = editor.text
        .split(/&nbsp;/)
        .filter(item => !!item)
        .join('');

      this.updateText();
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
          this.updateText();
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
      const content = next.replace(/static-text=|"/g, '');

      if (current !== 'custom' && next.includes('static-text')) {
        editor.text += this.setStaticText('static-text', content, false, false);
        editor.tail = '';
        this.updateText($event);
        return;
      }

      /*editor.text = $event.target.innerHTML;
      editor.placeholder = editor.text + editor.tail;*/
      this.updateText($event);

      if (this.dictionary[next]) {
        const input = `editor-${this.focused}-${this.level}`;
        this.$root.$emit('set-hint-state', true, next, '', input);
      }
    },
    fixStaticText ($event) {
      const [editor, current, next] = this.getSiblings($event);

      const parts = editor.text.split('</span>');
      const text = parts[parts.length[-1]].trim();

      editor.text += this.setStaticText(next, text);
      this.updateText();
    }
  }
};
