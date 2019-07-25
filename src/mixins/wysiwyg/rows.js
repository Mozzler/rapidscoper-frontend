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
    focusEditor (wysiwygEditor, context = this, greyed = false) {
      const el = context.$refs[wysiwygEditor][0];
      if (greyed) {
        el.classList.add('text-greyed');
      }

      el.focus();
    },
    getStoryPayload (sublist = false, text = '') {
      if (!sublist) {
        const number = this.editor.level === 1 ? 3 : 1;
        const data = this.getSpanList(false).slice(0, number);

        text = `${data.join('')}&nbsp;`;
      }

      return {
        parentStoryId: sublist ? this.editor.id : this.editor.parentStoryId,
        afterStoryId: this.editor.id,

        estimate: 0,
        priority: null,
        labels: [],
        level: sublist ? this.editor.level + 1 : this.editor.level,

        tail: '',
        placeholder: text,
        markup: text,
        template: sublist ? '' : this.editor.template,

        sectionId: this.editor.sectionId,
        teamId: this.editor.teamId,
        projectId: this.editor.projectId
      };
    },
    createRow ($event) {
      if (this.dictionary[this.next]) {
        this.createField($event);
        return;
      }

      if (this.next === 'beginning') { // could be a reason of the bug
        this.fixStaticText($event);
      } else {
        this.finishSentence($event);

        this.handleStoryRequest(false, $event.target.innerHTML);
      }
    },
    createSublist ($event) {
      if (!(this.editor.level < 3)) {
        $event.preventDefault();
        return;
      }

      this.finishSentence($event, ':');
      this.handleStoryRequest(true, '');
    },
    async handleStoryRequest (sublist, text = '') {
      let payloadToCreate = this.getStoryPayload(sublist, text);
      let payloadToUpdate = null;

      let startIndex = _.findIndex(this.list, item => item.id === this.editor.id);
      let replacementIndex = this.list.slice(startIndex)
        .findIndex(item => item.parentStoryId === this.editor.parentStoryId);
      if (replacementIndex !== -1 && startIndex + replacementIndex + 1 < this.list.length) {
        payloadToUpdate = {
          entity: 'story',
          params: {
            id: this.list[startIndex + replacementIndex + 1].id
          },
          data: {
            afterStoryId: null
          }
        };
      }

      const response = await this.$store.dispatch('entity/create', {
        entity: 'story',
        data: payloadToCreate
      });

      if (payloadToUpdate !== null) {
        payloadToUpdate.data.afterStoryId = response.item.id;
        await this.$store.dispatch('entity/update', payloadToUpdate);
      }

      this.$nextTick(() => {
        this.$refs[response.item.id][0].focus();
        document.execCommand('selectAll', false, null);
        document.getSelection().collapseToEnd();
      });
    },
    removeRow () {
      this.hideHint();

      if (this.level === 1 && this.list.length === 1) {
        return;
      }

      const deletable = this.getDeletableSet();
      const updatable = this.getNextStoryUpdate();

      // focus previous element
      this.list.splice(this.focused, 1);

      let chain = this.getElementToFocus(this.list[this.focused - 1], 1, this.focused - 1);
      eval(chain).focus();

      // delete element and sub-stories
      const requests = deletable.map(id => {
        return this.$store.dispatch('entity/delete', {
          entity: 'story',
          id: id
        });
      });

      Promise.all(requests).then(() => {
        console.log(updatable);
        if (updatable) { // update reference to previous for the next story
          this.$store.dispatch('entity/update', updatable);
        }
      });
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

        Object.assign(this.editor, {
          markup: this.createSpan('beginning', constructions[0].key, true),
          template: constructions[0].value,
          tail: '',
          type: 'user'
        });

        this.editor.placeholder = this.editor.markup;
      }

      // ADD AFTER STORY TO CONTENT GETTER!!!!

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
            this.focusEditor(editor, this.$parent, false);
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
    async remove ($event, index) {
      // allow to remove characters from editable div
      if (this.isEditable($event)) {
        return;
      }

      this.focused = index;

      if (!this.editor) {
        return;
      }

      const spans = this.editor.markup.split('</span>');

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
        if (this.editor.markup) {
          this.editor.markup = $event.target.innerHTML;
          //this.$refs[this.ref][0].classList.remove('text-greyed');
        }
      }
    }
  }
};
