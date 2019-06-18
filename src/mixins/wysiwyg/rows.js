export default {
  methods: {
    focus ($event, index) {
      this.focused = index;
    },
    pressed ($event) {
      this.$root.$emit('hide-hint');
      this.parseContent($event);
    },
    focusEditor (wysiwygEditor, context, greyed = false) {
      const el = context.$refs[wysiwygEditor][0];
      if (greyed) {
        el.classList.add('text-greyed');
      }

      el.focus();
    },
    addRowToList (prototype, text = '', sublist = false, template) {
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
      new Promise(resolve => {
        this.finishSentence($event);
        resolve();
      }).then(() => {
        const row = this.addRowToList(this.list[this.focused], $event.target.innerHTML);
        this.list.push(row);
      }).then(() => {
        const wysiwygChild = `editor-${ this.focused + 1 }-${ this.level }`;
        this.focusEditor(wysiwygChild, this, true);
      });
    },
    createSublist ($event) {
      if (!(this.level < 3)) {
        $event.preventDefault();
        return;
      }

      const index = this.list[this.focused].list.length;
      this.finishSentence($event, ':');

      new Promise(resolve => {
        const span = this.createSpan('beginning', this.adjustConstructions[0].key, true);
        const row = this.addRowToList(this.list[this.focused], span, true, this.adjustConstructions[0].value);

        this.list[this.focused].list.push(row);
        resolve();
      }).then(() => {
        const wysiwygChild = `wysiwyg-child-${ this.focused }-${ this.level }`;
        const wysiwygEditor = `editor-${ index }-${ this.level + 1 }`;
        this.focusEditor(wysiwygEditor, this.$refs[wysiwygChild][0]);
      });
    },
    decreaseSublistLevel ($event) {
      $event.preventDefault();
      if (this.level > 1) {
        new Promise(resolve => {
          const node = Object.assign({}, this.list[this.focused]);
          const list = node.parent.parent.list;
          list.splice(this.parentIndex + 1, 0, node);
          node.parent = node.parent.parent;
          resolve();
        }).then(() => {
          this.list.splice(this.focused, 1);
        });
      }
    },
    remove ($event) {
      const spans = this.editor.text.split('</span>');

      if (this.level === 1 && spans[1] === '&nbsp;') {
        $event.preventDefault();
      } else {
        setTimeout(() => {
          if (this.editor.text) {
            this.editor.text = $event.target.innerHTML;
            this.updateText();
            this.resetPlaceholder();
          }
        }, 10);
      }
    }
  }
};
