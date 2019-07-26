export default {
  methods: {
    updateStory () {
      if (this.tab !== 'edit' || !!this.processing) {
        return;
      }

      this.processing = this.editor.id;

      const index = _.findIndex(this.editor, item => item.id === this.editor.id);

      const payload = {
        entity: 'story',
        data: {
          type: this.editor.type,
          markup: this.editor.markup,
          afterStoryId: index === 0 ? 0 : this.list[index - 1].id,
          parentStoryId: this.editor.parentStoryId
        },
        params: {
          id: this.editor.id
        }
      };

      this.list[this.focused] = this.editor;

      return this.$store.dispatch('entity/update', payload)
        .then(() => {
          this.processing = null;
        });
    }
  }
};
