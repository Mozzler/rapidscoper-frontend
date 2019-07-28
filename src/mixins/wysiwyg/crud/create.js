export default {
  data () {
    return {
      nextIdToFocus: false,
      flags: {
        section: false,
        story: false
      }
    };
  },
  beforeMount () {
    this.$root.$on('editor-update', this.stopProcessing);
  },
  beforeDestroy () {
    this.$root.$off('editor-update', this.stopProcessing);
  },
  methods: {
    stopProcessing (model) {
      this.flags[model] = false;
      if (!this.flags.section && !this.flags.story && typeof this.nextIdToFocus === 'string') {
        this.processing = null;

        this.$nextTick(() => {
          this.$refs[this.nextIdToFocus][0].focus();
          document.execCommand('selectAll', false, null);
          document.getSelection().collapseToEnd();
          this.nextIdToFocus = false;
        });
      }
    },
    async sendCreateStoryRequest (sublist, text = '') {
      this.nextIdToFocus = true;
      const payload = this.getCreateRequestPayload(sublist, text);
      await this.updateStory();

      this.processing = this.editor.id;
      this.flags = {
        section: true,
        story: true
      };

      const response = await this.$store.dispatch('entity/create', payload);
      this.nextIdToFocus = response.item.id;
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
