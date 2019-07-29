export default {
  methods: {
    hideHint () {
      this.hintEditor = null;
      this.$root.$emit('hide-hint');
    },
    focusHint ($event) {
      this.hintEditor = this.editor.id;
      this.$root.$emit('focus-hint');
    },
    async showHint (el, chapter, filter = this.filter) {
      const rect = el.getBoundingClientRect();

      const position = {
        top: rect.top + 20,
        left: rect.left + 24
      };

      this.hintEditor = this.editor.id;
      await this.$nextTick();
      this.$root.$emit('set-hint-state', true, chapter, filter, position, this.editor.id);
    },
    checkHint ($event, item) {
      this.event = $event;

      let property = $event.target.className.replace('user-story__editable--', '');

      if (this.dictionary[property]) {
        /*if ($event.type === 'dblclick') {
          $event.target.contentEditable = true;
          $event.target.innerText = '';
        }*/

        this.$nextTick(() => {
          this.$refs[item.id][0].focus();
        });

        this.hideHint();
        this.showHint($event.target, property, '');
      }
    },
    async hintComplete (chapter, text, addresserId) {
      if (addresserId !== this.hintEditor) {
        return;
      }

      await this.$nextTick();
      this.$refs[this.editor.id][0].focus();
      await this.$nextTick();

      if (chapter === 'beginning') {
        this.editor.template = text.value;
        this.editor.type = text.type;

        if (text.type !== 'user' && this.editor.level === 0) {
          this.editor.parentStoryId = this.list[this.focused].id;
          this.editor.level += 1;
        }

        text = text.key;
      } else {
        this.submitField(chapter, text);
      }

      const spans = this.getSpanList(false);

      let index = null;
      spans.forEach((item, i) => {
        if (item.includes(`user-story__editable--${chapter}`)) {
          index = i;
        }
      });

      if (index !== null) {
        spans[index] = this.createSpan(chapter, text, false, false);
        this.editor.markup = spans.map(item => item.replace(/&nbsp;/gi, '')).join('&nbsp;');
      } else {
        let t = spans.join('');
        this.editor.markup = `${t}${!t ? '' : '&nbsp;'}${this.createSpan(chapter, text, false)}`;
        this.setCompletion();
      }

      this.filter = null;
      this.editor.tail = '';
      this.editor.placeholder = this.editor.markup;
      this.hideHint();
      this.collapseToEnd();
    },
    submitField (chapter, text) {
      if (typeof text !== 'string') {
        return;
      }

      this.$store.dispatch('entity/create', {
        entity: 'dictionary',
        data: {
          projectId: this.editor.projectId,
          teamId: this.editor.teamId,
          type: chapter,
          name: text,
          description: text
        }
      });
    }
  }
};
