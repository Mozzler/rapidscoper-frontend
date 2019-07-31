export default {
  methods: {
    async updateStory () {
      if (this.tab !== 'edit' || this.hintEditor !== null) {
        return;
      }

      this.processing = this.editor.id;
      const payload = this.getUpdateRequestPayload();

      await this.$store.dispatch('entity/update', payload);
    }
  }
};
