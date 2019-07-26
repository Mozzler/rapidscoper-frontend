export default {
  methods: {
    updateStory () {
      if (this.tab !== 'edit') {
        return;
      }

      this.processing = this.editor.id;

      const storyIndex = _.findIndex(this.list, item => item.id === this.editor.id);

      const payload = {
        entity: 'story',
        data: {
          type: this.editor.type,
          markup: this.editor.markup,
          afterStoryId: this.list[storyIndex - 1].id,
          parentStoryId: this.editor.parentStoryId
        },
        params: {
          id: this.editor.id
        }
      };

      return this.$store.dispatch('entity/update', payload)
        .then(() => {
          this.processing = null;
        });
    }
  }
};
