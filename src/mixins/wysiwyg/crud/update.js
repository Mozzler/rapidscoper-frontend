export default {
  methods: {
    equal () {
      return _.isEqual(this.editor, this.list[this.focused]);
    },
    async updateStory () {
      this.processing = this.editor.id;

      if (this.tab !== 'edit' || this.equal() ||
        this.hintEditor !== null || !this.editor) {
        this.processing = false;
        return;
      }

      const payload = this.getUpdateRequestPayload();

      await this.$store.dispatch('entity/update', payload);
      this.processing = false;
    }
  }
};
