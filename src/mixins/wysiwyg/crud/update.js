export default {
  methods: {
    async updateStory () {
      if (this.tab !== 'edit' || _.isString(this.nextIdToFocus) || this.hintEditor !== null) {
        return;
      }

      this.hideHint();
      this.processing = this.editor.id;
      const payload = this.getUpdateRequestPayload();

      await this.$store.dispatch('entity/update', payload);
      this.processing = null;
    }
  }
};
