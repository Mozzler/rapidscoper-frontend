export default {
  methods: {
    equal (focused = this.focused) {
      return _.isEqual(this.etalon, this.list[focused]);
    },
    async updateStory (focused = this.focused) {
      if (!this.list[focused]) {
        return;
      }

      this.processing = this.list[focused].id;

      if (this.tab !== 'edit' || this.hintEditor !== null) {
        this.processing = false;
        return;
      }

      const payload = this.getUpdateRequestPayload(focused);

      await this.$store.dispatch('entity/update', payload);
      this.processing = false;
    }
  }
};
