export default {
  methods: {
    async updateStory () {
      console.log(this.nextIdToFocus, 'update-story');
      if (this.tab !== 'edit' || _.isString(this.nextIdToFocus) || !this.editor) {
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
