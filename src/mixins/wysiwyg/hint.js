export default {
  watch: {
    hintEditor () {
      if (this.hintEditor === null) {
        this.$root.$emit('hide-hint');
      }
    }
  },
  computed: {
    sections () {
      return this.$store.getters['dictionary/items'];
    },
    rawSections () {
      return this.$store.getters['entity/items']('dictionary');
    }
  },
  beforeMount () {
    this.$root.$on('focus-story', this.focusStory);
  },
  methods: {
    focusStory (id) {
      this.$nextTick(() => {
        if (this.$refs[id]) {
          this.$refs[id][0].focus();
        }
      });
    },
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

      let keyword = null;

      if (chapter === 'field') {
        let relatedDictionary = this.getParentDictionary();
        keyword = relatedDictionary ? relatedDictionary.name : null;
      }

      this.$root.$emit('set-hint-state', true, chapter, filter, position, this.list[this.focused].id, keyword);
    },
    checkHint ($event, item, index) {
      this.focusEvent(item, index);

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
      document.getElementById(addresserId).focus();
      await this.$nextTick();
      this.hintEditor = null;

      if (chapter === 'beginning') {
        this.list[this.focused].template = text.value;
        this.list[this.focused].type = text.type;

        if (text.type !== 'user' && this.list[this.focused].level === 0) {
          this.list[this.focused].level += 1;
          this.list[this.focused].parentStoryId = this.list[this.focused - 1].level === this.list[this.focused].level ?
            this.list[this.focused - 1].parentStoryId : this.list[this.focused - 1].id;
        }

        text = text.key;
      } else {
        text = _.isObject(text) ?
          this.submitField(chapter, text.name, this.focused, text.id) :
          this.submitField(chapter, text, this.focused);
      }

      let spans = this.getSpanList(false);

      let index = null;
      spans.forEach((item, i) => {
        if (item.includes(`user-story__editable--${chapter}`)) {
          index = i;
        }
      });

      if (index !== null) {
        spans[index] = this.createSpan(chapter, text, false, false);

        if (chapter === 'requirement') {
          spans = spans.filter((item, i) => i <= index);
        }

        this.list[this.focused].markup = spans.join('&nbsp;');
      } else {
        let t = spans.join('&nbsp;');
        let span = this.createSpan(chapter, text, false, false);
        this.list[this.focused].markup = `${t}${!t ? '' : '&nbsp;'}${span}`;

        this.setCompletion();
      }

      this.filter = null;
      this.list[this.focused].tail = '';
      this.list[this.focused].placeholder = this.list[this.focused].markup;

      this.$store.commit('entity/update', {
        entity: 'story',
        data: this.list[this.focused]
      });
    },
    submitField (chapter, text, focused = this.focused, id = this.getObjectId()) {
      if (typeof text !== 'string') {
        return;
      }

      this.processing = true;

      let replacement = {
        type: chapter,
        relatedDictionaryId: null
      };

      // block of `field`-type always have the relatedDictionaryId
      if (chapter === 'field') {
        const parentDictionary = this.getParentDictionary(focused);

        replacement = {
          type: 'requirement',
          relatedDictionaryId: parentDictionary.id
        };
      }

      const data = {
        _id: id,
        id: id,
        projectId: this.list[focused].projectId,
        teamId: this.list[focused].teamId,
        name: text,
        description: '',
        type: replacement.type,
        relatedDictionaryId: replacement.relatedDictionaryId
      };

      const existed = _.find(this.rawSections, item =>
        item.name === data.name &&
        item.relatedDictionaryId === data.relatedDictionaryId &&
        item.type === data.type);

      if (!existed) {
        this.$store.dispatch('entity/create', {
          entity: 'dictionary',
          data: data
        });
      } else {
        data.id = existed.id;
      }

      this.processing = false;
      return {
        id: data.id,
        name: data.name
      };
    }
  }
};
