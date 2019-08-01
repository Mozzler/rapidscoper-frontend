export default {
  methods: {
    async reorder () {
      const payload = {
        entity: 'story',
        params: {
          id: this.list[this.focused].id
        },
        data: _.pick(this.list[this.focused], 'parentStoryId', 'afterStoryId', 'markup', 'type', 'level')
      };

      const response = await this.$store.dispatch('entity/update', payload);
      this.$nextTick(() => {
        this.$refs[response.item.id][0].focus();
      });
    },
    async increaseStoryLevel () {
      const index = _.findIndex(this.list, item => item.id === this.list[this.focused].id);

      if (this.list[this.focused].level === 2 || (this.list[this.focused].level === 0 && !index)) {
        return;
      }

      this.hideHint();
      if (this.list[this.focused].level === 0) {
        const equation = this.getEquation(this.list[this.focused].level + 1);
        const constructions = this.getAdjusted(equation);

        Object.assign(this.list[this.focused], {
          text: '',
          placeholder: '',
          tail: '',
          template: '',
          type: constructions[0].type
        });
      }

      const storyIndex = this.list.findIndex(item => item.id === this.list[this.focused].id);

      this.list[this.focused].afterStoryId = this.list[storyIndex - 1].id;
      this.list[this.focused].parentStoryId = this.list[storyIndex - 1].id;
      this.list[this.focused].level = this.list[this.focused].level + 1;

      this.reorder();
    },
    async decreaseStoryLevel ($event) {
      $event.preventDefault();
      this.hideHint();

      if (this.list[this.focused].level === 0) {
        return this.removeStory();
      }

      if (this.list[this.focused].level - 1 === 0) {
        const equation = this.getEquation(this.list[this.focused].level - 1);
        const constructions = this.getAdjusted(equation);

        Object.assign(this.list[this.focused], {
          markup: this.createSpan('beginning', constructions[0].key, true),
          template: constructions[0].value,
          tail: '',
          type: 'user'
        });
      }

      this.list[this.focused].placeholder = this.list[this.focused].markup;
      this.list[this.focused].afterStoryId = this.list[this.focused - 1].id;
      this.list[this.focused].parentStoryId = _.find(this.list, item => item.id === this.list[this.focused].parentStoryId).parentStoryId;
      this.list[this.focused].level = this.list[this.focused].level - 1;

      this.reorder();
    }
  }
};
