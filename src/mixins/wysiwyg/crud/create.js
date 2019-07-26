export default {
  methods: {
    getAfterStoryId () { // find the last child
      let filtered = _.filter(this.list, item => item.level === this.editor.level),
          index = _.findIndex(filtered, item => item.id === this.editor.id);

      let next = filtered[index + 1],
          afterIndex = _.findIndex(this.list, item => item.id === next.id);

      return this.list[afterIndex - 1].id;
    },
    getCreateRequestPayload (sublist = false, text = '') {
      if (!sublist) {
        const number = this.editor.level === 1 ? 3 : 1;
        const data = this.getSpanList(false).slice(0, number);

        text = `${data.join('')}&nbsp;`;
      }

      return {
        parentStoryId: sublist ? this.editor.id : this.editor.parentStoryId,
        afterStoryId: this.getAfterStoryId(),

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
    async sendCreateStoryRequest (sublist, text = '') {
      this.processing = this.editor.id;
      let payload = this.getCreateRequestPayload(sublist, text);

      const response = await this.$store.dispatch('entity/create', {
        entity: 'story',
        data: payload
      });

      this.$nextTick(() => {
        if (this.$refs[response.item.id]) {
          this.$refs[response.item.id][0].focus();
          this.collapseToEnd();
          this.processing = null;
        }
      });
    },
    createStory ($event) {
      if (this.dictionary[this.next]) {
        this.createField($event);
        return;
      }

      this.finishSentence($event);
      this.sendCreateStoryRequest(false, $event.target.innerHTML);
    },
    createSubstory ($event) {
      if (!(this.editor.level < 3)) {
        $event.preventDefault();
        return;
      }

      this.finishSentence($event, ':');
      this.sendCreateStoryRequest(true, '');
    }
  }
};
