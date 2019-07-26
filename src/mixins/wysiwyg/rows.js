export default {
  methods: {
    focus (item) {
      this.editor = item;
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

      if (this.editor.level === 0) {
        this.removeStory($event);
        return;
      }

      if (this.editor.level - 1 === 1) {
        const equation = this.getEquation(this.editor.level - 1);
        const constructions = this.getAdjusted(equation);

        Object.assign(this.editor, {
          markup: this.createSpan('beginning', constructions[0].key, true),
          template: constructions[0].value,
          tail: '',
          type: 'user'
        });

        this.editor.placeholder = this.editor.markup;
      }

      //const newParentStoryId = _.findIndex(this.list, item => item.)

      this.$store.dispatch('entity/update', {
        entity: 'story',
        params: {
          id: this.editor.id
        },
        data: {
          afterStoryId: '',
          parentStoryId: '',
          level: this.editor.level - 1,
          markup: this.editor.markup,
          type: this.editor.type
        }
      });

      // update reference to previous element for the story followed by current ---
      const dataToUpdate = [
        { id: node.id,
          data: _.pick(node, 'type', 'markup', 'parentStoryId', 'afterStoryId') }
      ];

      if (this.parentIndex + 2 < parent.list.length) {
        const next = {
          id: parent.list[this.parentIndex + 2].id,
          data: { afterStoryId: node.id }
        };

        dataToUpdate.push(next);
      }
      // ---
      this.reorderStory(dataToUpdate)
        .then(() => {
          this.$nextTick(() => {
            const editor = `editor-${ this.parentIndex + 1 }-${ this.level - 1 }`;
          });
        });
    },
    reorderStory (list) {
      const requests = [];

      _.each(list, item => {
        let payload = {
          entity: 'story',
          params: {
            id: item.id
          },
          data: item.data
        };
        requests.push(this.$store.dispatch('entity/update', payload));
      });

      return Promise.all(requests);
    },
    async remove ($event, item) {
      this.editor = item;

      // allow to remove characters from editable div
      if (this.isEditable($event)) {
        return;
      }

      if (!this.editor) {
        return;
      }

      const spans = this.editor.markup.split('</span>');

      if (this.editor.level > 0 && !this.getSpanList() && !this.getTail()) {
        await this.decreaseSublistLevel($event);
      }

      const spanList = this.getSpanList(false);
      if (this.editor.level === 0 && spanList.length === 1 && !this.getTail()) {
        this.removeStory();
      }

      if (this.editor.level === 0 && spans[1] === '&nbsp;') {
        $event.preventDefault();
      } else {
        if (this.editor.markup) {
          this.editor.markup = $event.target.innerHTML;
          this.$refs[this.editor.id][0].classList.remove('text-greyed');
        }
      }
    }
  }
};
