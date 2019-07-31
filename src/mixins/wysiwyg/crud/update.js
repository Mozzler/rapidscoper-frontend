export default {
  methods: {
    async updateStory () {
      if (this.tab !== 'edit') {
        return;
      }

      this.hideHint();
      this.processing = this.editor.id;
      const payload = this.getUpdateRequestPayload();

      this.$store.commit('story/initProcessing', ['story']);
      await this.$store.dispatch('entity/update', payload);
    }
  }
};
