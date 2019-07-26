export default {
  methods: {
    updateStory () {
      if (this.tab !== 'edit') {
        return;
      }

      this.processing = this.editor.id;

      const payload = {
        entity: 'story',
        data: {
          type: this.editor.type,
          markup: this.editor.markup
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
}
