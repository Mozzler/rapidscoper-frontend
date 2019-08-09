export default {
  methods: {
    async sendCreateStoryRequest (sublist, text = '') {
      await this.updateStory();

      this.processing = this.list[this.focused].id;
      const payload = this.getCreateRequestPayload(sublist, text);
      const response = await this.$store.dispatch('entity/create', payload);

      this.$socket.recreateWatchers('story', false);
      this.processing = false;

      return new Promise(resolve => {
        resolve(response.item.id);
      });
    },
    createStory ($event) {
      if (this.dictionary[this.next]) {
        this.createField($event);
        return;
      }

      this.finishSentence($event);
      this.sendCreateStoryRequest(false, $event.target.innerHTML)
        .then((id) => {
          this.$store.commit('story/setActiveStoryOnTab', id);
        });
    },
    createSubstory ($event) {
      if (this.list[this.focused].level === 2) {
        $event.preventDefault();
        return;
      }

      this.finishSentence($event, ':');
      this.sendCreateStoryRequest(true, '')
        .then((id) => {
          this.$store.commit('story/setActiveStoryOnTab', id);
        });
    }
  }
};
