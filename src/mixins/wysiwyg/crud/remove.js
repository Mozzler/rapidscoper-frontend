export default {
  methods: {
    removeStory () {
      this.processing = this.editor.id;
      this.hideHint();

      if (this.editor.level === 1 && this.list.length === 1) {
        return;
      }

      const previousId = _.findIndex(this.list, item => item.id === this.editor.id);
      this.$store.dispatch('entity/delete', {
        entity: 'story',
        id: this.editor.id
      }).then(() => {
        this.$nextTick(() => {
          this.$refs[this.list[previousId].id][0].focus();
          this.processing = null;
        });
      });
    }
  }
};
