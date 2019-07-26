export default {
  methods: {
    async reorder () {
      const payload = {
        entity: 'story',
        params: {
          id: this.editor.id
        },
        data: _.pick(this.editor, 'parentStoryId', 'afterStoryId', 'markup', 'type', 'level')
      };

      const response = await this.$store.dispatch('entity/update', payload);
      this.$nextTick(() => {
        this.$refs[response.item.id][0].focus();
      });
    },
    async increaseStoryLevel () {
      const index = _.findIndex(this.list, item => item.id === this.editor.id);

      if (this.level === 2 || (this.level === 0 && !index)) {
        return;
      }

      this.hideHint();
      if (this.level === 0) {
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

      const storyIndex = this.list.findIndex(item => item.id === this.editor.id);

      this.editor.afterStoryId = this.list[storyIndex - 1].id;
      this.editor.parentStoryId = this.list[storyIndex - 1].id;
      this.editor.level = this.editor.level + 1;

      this.reorder();
    },
    async decreaseStoryLevel($event) {
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

        this.editor.afterStoryId = this.editor.parentStoryId;
        this.editor.parentStoryId = this.list.find(item => item.id === this.editor.parentStoryId).parentStoryId;
        this.editor.level = this.editor.level - 1;

        this.reorder();
      }
    }
  }
};
