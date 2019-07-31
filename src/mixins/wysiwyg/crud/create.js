export default {
  data () {
    return {
      nextIdToFocus: false
    };
  },
  beforeMount () {
    this.$root.$on('stop-processing', this.stopProcessing);
  },
  beforeDestroy () {
    this.$root.$off('stop-processing', this.stopProcessing);
  },
  methods: {
     async stopProcessing () {
      await this.$nextTick();
      this.processing = null;

      if (this.$refs[this.nextIdToFocus]) {
        this.$refs[this.nextIdToFocus][0].focus();
        document.execCommand('selectAll', false, null);
        document.getSelection().collapseToEnd();
      }

      this.nextIdToFocus = false;
    },
    async sendCreateStoryRequest (sublist, text = '') {
      this.nextIdToFocus = true;
      await this.updateStory();

      this.processing = this.editor.id;
      const payload = this.getCreateRequestPayload(sublist, text);
      const response = await this.$store.dispatch('entity/create', payload);
      this.nextIdToFocus = response.item.id;

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
      if (this.editor.level === 2) {
        $event.preventDefault();
        return;
      }

      this.finishSentence($event, ':');
      this.sendCreateStoryRequest(true, '');
    }
  }
};
