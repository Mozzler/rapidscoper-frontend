export default {
  methods: {
    equal () {
      return _.isEqual(this.etalon, this.list[this.focused]);
    },
    async updateStory () {
      if (!this.list[this.focused]) {
        return;
      }

      this.processing = this.list[this.focused].id;

      if (this.tab !== 'edit' || this.equal() || this.hintEditor !== null) {
        this.processing = false;
        return;
      }

      const payload = this.getUpdateRequestPayload();

      await this.$store.dispatch('entity/update', payload);
      this.processing = false;
    }
  }
};
