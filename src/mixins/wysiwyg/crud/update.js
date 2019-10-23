export default {
  methods: {
    equal (focused = this.focused) {
      return _.isEqual(this.etalon, this.list[focused]);
    },
    async updateStory (focused = this.focused) {
      this.setCustomText();
      if (!this.list[focused] || this.equal(focused)) {
        return;
      }

      this.processing = this.list[focused].id;

      if (this.tab !== 'edit' || this.hintEditor !== null) {
        this.processing = false;
        return;
      }

      const payload = this.getUpdateRequestPayload(focused);

      this.$store.commit('entity/update', payload);
      await this.$store.dispatch('entity/update', payload);
      this.processing = false;
    }
  }
};
