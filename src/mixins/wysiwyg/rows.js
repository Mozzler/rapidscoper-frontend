export default {
  methods: {
    focus ($event, index) {
      this.focused = index;
    },
    isEditable (event) {
      if (!event) {
        return false;
      }

      const focused = event.view.getSelection().focusNode;
      const node = focused ? event.view.getSelection().focusNode.parentElement : null;
      return node && node.className.includes('custom');
    },
    pressed ($event) {
      if (!this.isEditable($event)) {
        this.parseContent($event);
      }
    },
    focusEditor (wysiwygEditor, context = this, greyed = false) {
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
        id: null,
        parentStoryId: sublist ? prototype.id : prototype.parentStoryId,
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
    rowIsEmpty () {
      const spans = this.getSpanList(false);
      const tail = this.getTail();

      const main = this.level === 1 && spans.length === 1 && !tail;
      const sub = this.level !== 1 && !spans.length && !tail;

      return main || sub;
    },
    async createRow ($event) {
      if (this.rowIsEmpty()) {
        $event.preventDefault();
        await this.decreaseSublistLevel($event);
        return;
      }

      if (this.dictionary[this.next]) {
        this.createField($event);
        return;
      }

      if (this.next === 'beginning') {
        this.fixStaticText($event);
      } else {
        new Promise((resolve, reject) => {
          const finished = this.finishSentence($event);
          finished !== false ? resolve() : reject(new Error('invalid sentence construction'));
        }).then(() => {
          const row = this.addRowToList(this.list[this.focused], $event.target.innerHTML);
          this.list.splice(this.focused + 1, 0, row);
        }).then(() => {
          const wysiwygChild = `editor-${ this.focused + 1 }-${ this.level }`;
          this.focusEditor(wysiwygChild, this, true);
        }).then(() => {
          this.saveStory(this.list[this.focused].id, this.focused);
        });
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
      if (this.level === 1 && this.list.length === 1) {
        return;
      }

      this.hideHint();

      const data = {
        entity: 'story',
        id: this.list[this.focused].id,
        parentStoryId: this.list[this.focused].parentStoryId
      };

      this.list.splice(this.focused, 1);
      let chain = this.getElementToFocus(this.list[this.focused - 1], 1, this.focused - 1);
      eval(chain).focus();

      this.$store.dispatch('entity/delete', data);
    },
    async increaseSublistLevel () {
      if (this.level === 3 || (this.level === 1 && this.focused === 0)) {
        return;
      }

      this.hideHint();
      if (this.level === 1) {
        const equation = this.getEquation(this.level + 1);
        const constructions = this.getAdjusted(equation);

        Object.assign(this.list[this.focused], {
          text: '',
          placeholder: '',
          tail: '',
          template: '',
          type: constructions[0].type
        });
      }

      const node = Object.assign({}, this.list[this.focused]);
      const parent = this.list[this.focused - 1].list;

      node.parent = this.list[this.focused - 1];
      node.parentStoryId = node.parent.id;
      node.afterStoryId = parent.length ? parent[parent.length - 1].id : this.list[this.focused].parentStoryId;

      parent.push(node);
      this.list.splice(this.focused, 1);

      this.$nextTick(() => {
        const content = this.$refs[`wysiwyg-child-${ this.focused - 1 }-${ this.level }`][0];
        const editor = `editor-${ parent.length - 1 }-${ this.level + 1 }`;

        content.$refs[editor][0].focus();
      });

      this.reorderStory(node);
    },
    async decreaseSublistLevel ($event) {
      this.hideHint();

      $event.preventDefault();

      if (this.level === 1) {
        this.removeRow($event);
        return;
      }

      if (this.level - 1 === 1) {
        const equation = this.getEquation(this.level - 1);
        const constructions = this.getAdjusted(equation);

        this.list[this.focused].text = this.createSpan('beginning', constructions[0].key, true);
        this.list[this.focused].template = constructions[0].value;
        this.list[this.focused].tail = '';
        this.list[this.focused].placeholder = this.list[this.focused].text;
        this.list.type = 'user';
      }

      const node = Object.assign({}, this.list[this.focused]);
      const parent = node.parent.parent;

      node.parent = parent;
      node.parentStoryId = parent && parent.id ? parent.id : null;
      node.afterStoryId = parent.list[this.parentIndex] ? parent.list[this.parentIndex].id : 0;

      this.list.splice(this.focused, 1);
      parent.list.splice(this.parentIndex + 1, 0, node);

      this.reorderStory(node)
        .then(() => {
          const editor = `editor-${ this.parentIndex + 1 }-${ this.level - 1 }`;
          this.focusEditor(editor, this.$parent, false);
        });
    },
    reorderStory (node) {
      return this.$store.dispatch('entity/update', {
        entity: 'story',
        params: {
          id: node.id
        },
        data: {
          type: node.type,
          markup: node.text,
          parentStoryId: node.parentStoryId,
          afterStoryId: node.afterStoryId
        }
      });
    },
    async remove ($event, index) {
      // allow to remove characters from editable div
      if (this.isEditable($event)) {
        return;
      }

      this.focused = index;

      if (!this.editor) {
        return;
      }

      const spans = this.editor.text.split('</span>');

      if (this.level > 1 && !this.getSpanList() && !this.getTail()) {
        await this.decreaseSublistLevel($event);
      }

      const spanList = this.getSpanList(false);
      if (this.level === 1 && spanList.length === 1 && !this.getTail()) {
        this.removeRow();
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
