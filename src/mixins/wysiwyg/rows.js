export default {
  methods: {
    focus ($event, index) {
      this.focused = index;
    },
    pressed ($event) {
      this.parseContent($event);
    },
    focusEditor (wysiwygEditor, context, greyed = false) {
      const el = context.$refs[wysiwygEditor][0];
      if (greyed) {
        el.classList.add('text-greyed');
      }

      el.focus();
    },
    addRowToList (prototype, text = '', sublist = false, template = '') {

      if (!sublist) {
        const number = this.level === 1 ? 3 : 1;
        const data = this.getSpanList(false).slice(0, number);

        text = `${data.join('')}&nbsp;`;
      }

      return {
        parent: sublist ? prototype : prototype.parent,
        estimation: null,
        priority: null,
        label: null,
        tail: '',
        placeholder: text,

        text: text,
        template: sublist ? template : prototype.template,

        list: []
      };
    },
    createRow ($event) {
      if (this.dictionary[this.next] || this.next === 'beginning') {
        this.fixStaticText($event);
      } else {
        new Promise((resolve, reject) => {
          const finished = this.finishSentence($event);
          finished !== false ? resolve() : reject(new Error('invalid sentence construction'));
        }).then(() => {
          const row = this.addRowToList(this.list[this.focused], `$event.target.innerHTML`);
          this.list.push(row);
        }).then(() => {
          const wysiwygChild = `editor-${ this.focused + 1 }-${ this.level }`;
          this.focusEditor(wysiwygChild, this, true);
        }).catch(() => {});
      }
    },
    createSublist ($event) {
      if (!(this.level < 3)) {
        $event.preventDefault();
        return;
      }

      const index = this.list[this.focused].list.length;
      this.finishSentence($event, ':');

      new Promise(resolve => {
        const row = this.addRowToList(this.list[this.focused], '', true, '');

        this.list[this.focused].list.push(row);

        resolve();
      }).then(() => {
        const wysiwygChild = `wysiwyg-child-${ this.focused }-${ this.level }`;
        const wysiwygEditor = `editor-${ index }-${ this.level + 1 }`;
        this.focusEditor(wysiwygEditor, this.$refs[wysiwygChild][0]);
      });
    },
    removeRow () {
      this.list.splice(this.focused, 1);
    },
    decreaseSublistLevel ($event) {
      this.hide();

      $event.preventDefault();

      if (this.level === 1) {
        console.log($event);
        this.removeRow($event);
        return;
      }

      new Promise(resolve => {
        if (this.level - 1 === 1) {
          const equation = this.getEquation(this.level - 1);
          const constructions = this.getAdjusted(equation);

          this.list[this.focused].text = this.createSpan('beginning', constructions[0].key, true);
          this.list[this.focused].template = constructions[0].value;
        }

        const node = Object.assign({}, this.list[this.focused]);
        const list = node.parent.parent.list;

        list.splice(this.parentIndex + 1, 0, node);
        node.parent = node.parent.parent;
        resolve();
      }).then(() => {
        this.list.splice(this.focused, 1);
      });
    },
    remove ($event, index) {
      this.focused = index;
      const spans = this.editor.text.split('</span>');

      if (this.level > 1 && !this.getSpanList() && !this.getTail()) {
        this.decreaseSublistLevel($event);
      }

      if (this.level === 1 && !this.getSpanList() && !this.getTail()) {
        console.log('remove');
      }

      if (this.level === 1 && spans[1] === '&nbsp;') {
        $event.preventDefault();
      } else {
        if (this.editor.text) {
          this.editor.text = $event.target.innerHTML;
          this.$refs[this.ref][0].classList.remove('text-greyed');
        }
      }
    }
  }
};
