export default {
  methods: {
    getPreviousAfterStoryId () {
      return this.focused === 0 ? 0 : this.list[this.focused - 1].id;
    },
    getAfterStoryId () {
      const substoryIndex = (this.focused + 1 < this.list.length) &&
        (this.list[this.focused + 1].level > this.list[this.focused].level);

      if (substoryIndex) {
        let nextStoryIndex = _.findIndex(this.list, (item, index) =>
          this.list[this.focused].level === item.level && (this.focused < index)
        );

        if (nextStoryIndex === -1) {
          nextStoryIndex = this.list.length;
        }

        return [...this.list].slice(this.focused + 1, nextStoryIndex).pop().id;
      } else {
        return this.list[this.focused].id;
      }
    },
    getCreateRequestPayload (sublist = false, text = '') {
      if (!sublist) {
        const number = this.list[this.focused].level === 1 ? 3 : 1;
        const data = this.getSpanList(false).slice(0, number);

        text = `${data.join('')}&nbsp;`;
      }

      const data = {
        parentStoryId: sublist ? this.list[this.focused].id : this.list[this.focused].parentStoryId,
        afterStoryId: sublist ? this.list[this.focused].id : this.getAfterStoryId(),

        estimate: 0,
        priority: null,
        labels: [],
        level: sublist ? this.list[this.focused].level + 1 : this.list[this.focused].level,

        tail: '',
        placeholder: '',
        markup: '',
        template: '',

        sectionId: this.list[this.focused].sectionId,
        teamId: this.list[this.focused].teamId,
        projectId: this.list[this.focused].projectId
      };

      return {
        entity: 'story',
        data: data
      };
    },
    getUpdateRequestPayload () {
      const data = {
        type: this.list[this.focused].type,
        markup: this.list[this.focused].markup,
        afterStoryId: this.getPreviousAfterStoryId(),
        parentStoryId: this.list[this.focused].parentStoryId,
        level: this.list[this.focused].level
      };

      return {
        entity: 'story',
        data: data,
        params: {
          id: this.list[this.focused].id
        }
      };
    },
    getSubstoryIds () {
      const lastIndexId = this.getAfterStoryId();
      const lastIndex = _.findIndex(this.list, item => item.id === lastIndexId);

      return this.list
        .slice(this.focused, lastIndex + 1)
        .map(item => item.id);
    }
  }
};
