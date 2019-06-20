export default {
  methods: {
    getStaticText (increments = 1) {
      const nodes = this.$refs[this.ref][0].childNodes;
      nodes.filter = [].filter;

      const classes = nodes
        .filter(item => item.nodeName !== '#text')
        .map(item => {
          let value = item.className.replace(/user-story__editable--| text-greyed/gi, '');

          if (value === 'static-text') {
            value += `="${item.textContent}"`;
          }

          return value;
        });

      const templates = this.editor.template
        .split(/(?=\[)/g)
        .map(item => item.replace(/[[\]]/g, ''));

      const last = classes.length - 1;
      const index = templates.indexOf(classes[last]) + 1;

      return index + increments < templates.length ? templates[index + increments] : null;
    },
    getSpanList (joined = true) {
      const spans = this.editor.text
        .split('</span>')
        .filter(item => item.includes('<span'))
        .map(item => `${item}</span>`);

      return !joined ? spans : spans.join('');
    },
    getTail () {
      return this.editor.text
        .split('</span>')
        .filter(item => !item.includes('<span'))
        .join('')
        .replace(/&nbsp;/g, '')
        .trim();
    },
    getStaticTextByType (str = this.next) {
      return str
        .split('=')
        .map(item => item.replace(/"|\]/g, ''));
    },
    getCurrentSpan () {
      const node = this.event.view.getSelection().focusNode;

      if (!this.editor.text || !this.editor.template || !node.previousSibling) {
        this.editor.template = '';
        return null;
      }

      let current = node.parentNode.className.replace(' text-greyed', '');

      if (current === 'user-story__editable') {
        current = node.previousSibling.className;

        if (current.includes('beginning')) {
          this.editor.text = this.editor.text.replace(/ text-greyed/, '');
        }
      }

      return this.classToType(current);
    },
    getNextSpan () {
      const parts = this.editor.template
        .split(/[[(.*)\]]/)
        .filter(item => !!item.trim());

      if (!this.editor.text || !this.editor.template) {
        return 'beginning';
      }

      if (this.previous === 'static-text') {
        const html = document.getSelection().focusNode.previousSibling.innerHTML.trim();
        this.previous += `="${html}"`;
      }

      const next = parts.indexOf(this.previous) + 1;
      return parts[next];
    },
    getLineParticles () {
      return [this.getSpanList(), this.getTail()];
    },
    getCompletion (greyed = false) {
      let next = this.next;
      let completion = null;
      let span = null;

      switch (true) {
        case next === 'custom':
          next = this.getStaticText(1);
          if (next && next.includes('static-text')) {
            completion = next;
          }
          break;
        case next.includes('static-text'):
          completion = next;
          break;
      }

      if (completion !== null) {
        const [type, text] = this.getStaticTextByType(completion);
        span = this.createSpan(type, text, greyed);
      }

      return span;
    }
  }
};
