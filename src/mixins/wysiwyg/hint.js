export default {
  watch: {
    hintEditor () {
      if (this.hintEditor === null) {
        this.$root.$emit('hide-hint');
      }
    }
  },
  methods: {
    hideHint () {
      //this.hintEditor = null;
    },
    focusHint ($event) {
      this.hintEditor = this.list[this.focused].id;
      this.$root.$emit('focus-hint');
    },
    async showHint (el, chapter, filter = this.filter) {
      const rect = el.getBoundingClientRect();

      const position = {
        top: rect.top + 20,
        left: rect.left + 24
      };

      this.hintEditor = this.list[this.focused].id;
      await this.$nextTick();
      this.$root.$emit('set-hint-state', true, chapter, filter, position, this.list[this.focused].id);
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
      this.$refs[this.list[this.focused].id][0].focus();
      await this.$nextTick();

      if (chapter === 'beginning') {
        this.list[this.focused].template = text.value;
        this.list[this.focused].type = text.type;

        if (text.type !== 'user' && this.list[this.focused].level === 0) {
          this.list[this.focused].level += 1;
          this.list[this.focused].parentStoryId = this.list[this.focused - 1].level === this.list[this.focused].level ?
            this.list[this.focused - 1].parentStoryId : this.list[this.focused - 1].id;
          this.nextIdToFocus = false;
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
        this.list[this.focused].markup = spans.map(item => item.replace(/&nbsp;/gi, '')).join('&nbsp;');
      } else {
        let t = spans.join('');
        this.list[this.focused].markup = `${t}${!t ? '' : '&nbsp;'}${this.createSpan(chapter, text, false)}`;
        this.setCompletion();
      }

      this.filter = null;
      this.list[this.focused].tail = '';
      this.list[this.focused].placeholder = this.list[this.focused].markup;
      this.hintEditor = null;
      this.collapseToEnd();
    },
    submitField (chapter, text) {
      if (typeof text !== 'string') {
        return;
      }

      this.$store.dispatch('entity/create', {
        entity: 'dictionary',
        data: {
          projectId: this.list[this.focused].projectId,
          teamId: this.list[this.focused].teamId,
          type: chapter,
          name: text,
          description: text
        }
      });
    }
  }
};
