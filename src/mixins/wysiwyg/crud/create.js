export default {
  methods: {
    getUpdateRequestPayload () {
      return {
        entity: 'story',
        params: {
          id: this.editor.id
        },
        data: _.pick(this.editor, 'markup', 'type')
      };
    },
    getCreateRequestPayload (sublist = false, text = '') {
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
    sendCreateStoryRequest (sublist, text = '') {
      this.processing = this.editor.id;
      let createPayload = this.getCreateRequestPayload(sublist, text);
      let updatePayload = this.getUpdateRequestPayload();

      Promise.all([
        this.$store.dispatch('entity/update', updatePayload),
        this.$store.dispatch('entity/create', {
          entity: 'story',
          data: createPayload
        })
      ]).then(response => {
        this.$nextTick(() => {
          this.$refs[response[1].item.id][0].focus();
          document.execCommand('selectAll', false, null);
          document.getSelection().collapseToEnd();
          this.processing = null;
        });
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
