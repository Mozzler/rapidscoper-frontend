export default {
  methods: {
    async sendCreateStoryRequest (sublist, text = '') {
      const payload = this.getCreateRequestPayload(sublist, text);

      this.$store.commit('entity/create', payload);
      this.$store.commit('entity/reorder', payload.data);
      this.$store.commit('story/setActiveStoryOnTab', payload.data.id);

      await this.$nextTick();
      document.getElementById(payload.data.id).focus();

      await this.$store.dispatch('entity/create', payload);
      this.$socket.recreateWatchers('story', false);
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
      if (this.list[this.focused].level === 2) {
        $event.preventDefault();
        return;
      }

      this.finishSentence($event, ':');
      this.sendCreateStoryRequest(true, '');
    }
  }
};
