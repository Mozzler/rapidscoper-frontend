const CUSTOM_PHRASE = 'user-story__editable--other';

export default {
  methods: {
    getFocusedEl () {
      const id = this.list[this.focused].id;
      return document.getElementById(id);
    },
    getStaticText (increments = 1) {
      const nodes = this.getFocusedEl().children;
      nodes.filter = [].filter;

      const classes = nodes
        .filter(item => !item.className.includes(CUSTOM_PHRASE))
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
      const children = this.getFocusedEl().children;
      const spans = _.chain(children)
        .filter(child => !child.className.includes(CUSTOM_PHRASE))
        .map(child => child.outerHTML)
        .value();

      return !joined ? spans : spans.join('&nbsp;');
    },
    getTail (cleared = false) {
      /*const nodes = this.getFocusedEl().childNodes;
      const index = _.findLastIndex(nodes, node => {
        return node.nodeType === 1 && !node.className.includes(CUSTOM_PHRASE);
      });*/
      const nodes = this.list[this.focused].markup.split('</span>');
      const index = _.findLastIndex(nodes, node => node.includes('<span'));

      let tail = _.filter(nodes, (node, i) => i > index).join('');

      if (cleared) {
        let splitted = tail.split(/&nbsp;|\u00a0/);
        if (!_.last(splitted)) {
          splitted.splice(-1, 1);
        }
        tail = splitted.join('&nbsp;');
      }

      return tail;
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

      let el = null;
      let current = node.parentNode.className.replace(' text-greyed', '');

      if (current === 'user-story__editable') {
        el = node.previousSibling;
        current = el.className;

        if (!current) {
          el = node;
          current = node.className;
        }
        if (current && current.includes(CUSTOM_PHRASE)) {
          el = el.previousElementSibling;
          current = el.className;
        }
        if (current && current.includes('beginning')) {
          this.list[this.focused].markup = this.list[this.focused].markup.replace(/ text-greyed/, '');
        }
      }

      let cls = this.classToType(current);
      if (cls === 'static-text') {
        cls += `="${el.innerHTML}"`;
      }

      return cls;
    },
    getNextSpan () {
      const parts = this.list[this.focused].template
        .split(/[[(.*)\]]/)
        .filter(item => !!item.trim());

      if (!this.list[this.focused].markup || !this.list[this.focused].template) {
        return 'beginning';
      }

      const next = parts.indexOf(this.previous) + 1;
      return parts[next];
    },
    getLineParticles (clearedTail = false) {
      return [this.getSpanList(), this.getTail(clearedTail)];
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
    },
    getParentDictionary (focused = this.focused) {
      const children = this.$refs[this.list[focused].id][0].children;
      const div = _.find(children, item => item.className === 'user-story__editable--requirement');

      return _.find(this.sections, item => item.name === div.innerText);
    }
  }
};
