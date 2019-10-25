export default {
  methods: {
    equal (focused = this.focused) {
      return _.isEqual(this.etalon, this.list[focused]);
    },
    async updateStory (focused = this.focused) {
      this.setCustomText();

      const excluded = !this.list[focused] ||
        this.equal(focused) ||
        this.tab !== 'edit' ||
        this.hintEditor !== null;

      if (excluded) {
        return;
      }

      this.processing = this.list[focused].id;
      const payload = this.getUpdateRequestPayload(focused);

      this.resetFocusedAutocomplete();
      await this.$store.dispatch('entity/update', payload);
      this.processing = false;
    }
  }
};
