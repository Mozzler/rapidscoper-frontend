export default {
  data () {
    return {
      nextIdToFocus: false
    };
  },
  methods: {
    async stopProcessing () {
      this.processing = null;
      await this.$nextTick();

      if (this.$refs[this.nextIdToFocus]) {
        this.$refs[this.nextIdToFocus][0].focus();
        document.execCommand('selectAll', false, null);
        document.getSelection().collapseToEnd();
        this.nextIdToFocus = false;
      }
    },
    async sendCreateStoryRequest (sublist, text = '') {
      this.nextIdToFocus = true;
      await this.updateStory();

      this.processing = this.list[this.focused].id;
      const payload = this.getCreateRequestPayload(sublist, text);
      const response = await this.$store.dispatch('entity/create', payload);

      this.$socket.recreateWatchers('story', false);
      this.processing = false;

      await this.$nextTick();

      return new Promise(resolve => {
        resolve(response.item.id)
      });
    },
    createStory ($event) {
      if (this.dictionary[this.next]) {
        this.createField($event);
        return;
      }

      this.finishSentence($event);
      this.sendCreateStoryRequest(false, $event.target.innerHTML)
        .then(() => {
          if (this.$refs[this.toolId]) {
            this.$refs[this.toolId][0].focus();
            this.collapseToEnd();
          }
        });
    },
    createSubstory ($event) {
      if (this.list[this.focused].level === 2) {
        $event.preventDefault();
        return;
      }

      this.finishSentence($event, ':');
      this.sendCreateStoryRequest(true, '');
    }
  }
};
