export default {
  methods: {
    async updateStory () {
      if (this.tab !== 'edit' || typeof this.nextIdToFocus === 'string') {
        return;
      }

      this.hideHint();
      this.processing = this.editor.id;
      const payload = this.getUpdateRequestPayload();

      await this.$store.dispatch('entity/update', payload)
        .then(() => {
          this.processing = null;
        });
    }
  }
};
