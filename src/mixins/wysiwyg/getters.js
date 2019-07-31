export default {
  methods: {
    getStaticText (increments = 1) {
      const nodes = this.$refs[this.list[this.focused].id][0].childNodes;
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

      const templates = this.list[this.focused].template ? this.list[this.focused].template
        .split(/(?=\[)/g)
        .map(item => item.replace(/[[\]]/g, '')) : [];

      const last = classes.length - 1;
      const index = templates.indexOf(classes[last]) + 1;

      return index + increments < templates.length ? templates[index + increments] : null;
    },
    getSpanList (joined = true) {
      const spans = this.list[this.focused].markup
        .split('</span>')
        .filter(item => item.includes('<span'))
        .map(item => `${item}</span>`);

      return !joined ? spans : spans.join('');
    },
    getTail () {
      return this.list[this.focused].markup
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

      if (!this.list[this.focused].markup || !this.list[this.focused].template || !node ||  !node.previousSibling) {
        this.list[this.focused].template = '';
        return null;
      }

      let current = node.parentNode.className.replace(' text-greyed', '');

      if (current === 'user-story__editable') {
        current = node.previousSibling.className;

        if (current.includes('beginning')) {
          this.list[this.focused].markup = this.list[this.focused].markup.replace(/ text-greyed/, '');
        }
      }

      return this.classToType(current);
    },
    getNextSpan () {
      const parts = this.list[this.focused].template
        .split(/[[(.*)\]]/)
        .filter(item => !!item.trim());

      if (!this.list[this.focused].markup || !this.list[this.focused].template) {
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
    getElementToFocus (item, level, index, path = 'this') {
      const length = item.list.length;

      let start = 'editor';
      let end = `${index}-${level}`;
      if (length) {
        start = `wysiwyg-child`;
      }

      path += `.$refs['${start}-${end}'][0]`;

      const list = length ? item.list[length - 1] : null;
      return list ? this.getElementToFocus(list, ++level, length - 1, path) : path;
    }
  }
};
