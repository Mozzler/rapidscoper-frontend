export default {
  methods: {
    getStaticText (increments = 1) {
      const nodes = this.$refs[this.ref][0].childNodes;
      nodes.filter = [].filter;

      const classes = nodes
        .filter(item => item.nodeName !== '#text')
        .map(item => item.className.replace('user-story__editable--', ''));

      const templates = this.editor.template
        .split(/(?=\[)/g)
        .map(item => item.replace(/[[\]]/g, ''));

      let i = 0;
      for (; i < classes.length; i++) {
        if (!templates[i].includes(classes[i])) {
          break;
        }
      }

      return i + increments < templates.length ? templates[i + increments] : null;
    },
    getSpanList () {
      return this.editor.text
        .split('</span>')
        .filter(item => item.includes('<span'))
        .map(item => `${item}</span>`)
        .join('');
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
