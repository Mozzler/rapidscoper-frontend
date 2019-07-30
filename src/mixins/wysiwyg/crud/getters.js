export default {
  methods: {
    getPreviousAfterStoryId () {
      return this.focused === 0 ? 0 : this.list[this.focused - 1].id;
    },
    getAfterStoryId () {
      const substoryIndex = (this.focused + 1 < this.list.length) &&
        (this.list[this.focused + 1].level > this.editor.level);

      if (substoryIndex) {
        let nextStoryIndex = _.findIndex(this.list, (item, index) =>
          this.editor.level === item.level && (this.focused < index)
        );

        if (nextStoryIndex === -1) {
          nextStoryIndex = this.list.length;
        }

        return [...this.list].slice(this.focused + 1, nextStoryIndex).pop().id;
      } else {
        return this.editor.id;
      }
    },
    getCreateRequestPayload (sublist = false, text = '') {
      if (!sublist) {
        const number = this.editor.level === 1 ? 3 : 1;
        const data = this.getSpanList(false).slice(0, number);

        text = `${data.join('')}&nbsp;`;
      }

      const data = {
        parentStoryId: sublist ? this.editor.id : this.editor.parentStoryId,
        afterStoryId: sublist ? this.editor.id : this.getAfterStoryId(),

        estimate: 0,
        priority: null,
        labels: [],
        level: sublist ? this.editor.level + 1 : this.editor.level,

        tail: '',
        placeholder: '',
        markup: '',
        template: '',

        sectionId: this.editor.sectionId,
        teamId: this.editor.teamId,
        projectId: this.editor.projectId
      };

      return {
        entity: 'story',
        data: data
      };
    },
    getUpdateRequestPayload () {
      const data = {
        type: this.editor.type,
        markup: this.editor.markup,
        afterStoryId: this.getPreviousAfterStoryId(),
        parentStoryId: this.editor.parentStoryId
      };

      return {
        entity: 'story',
        data: data,
        params: {
          id: this.editor.id
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
