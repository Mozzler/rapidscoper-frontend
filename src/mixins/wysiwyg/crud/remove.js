export default {
  methods: {
    async removeStory () {
      this.hideHint();
      await this.$nextTick();
      this.$refs[this.editor.id][0].focus();

      this.processing = this.editor.id;

      if (this.editor.level === 0 && this.list.length === 1) {
        return;
      }

      const previousId = _.findIndex(this.list, item => item.id === this.editor.id);
      await this.$store.dispatch('entity/delete', {
        entity: 'story',
        id: this.editor.id
      });

      await this.$nextTick();
      this.$refs[this.list[previousId].id][0].focus();
      this.processing = null;
      this.editor = null;
    },
    async remove ($event) {
      this.event = $event;

      // allow to remove characters from editable div
      if (this.isEditable()) {
        return;
      }

      if (!this.editor) {
        return;
      }

      if (this.editor.level > 0 && !this.getSpanList() && !this.getTail()) {
        await this.decreaseStoryLevel($event);
      }

      if (this.editor.level === 0 && !this.editor.markup.length) {
        this.removeStory();
      }

      const spans = this.getSpanList(false).length === 1;
      if (this.editor.level === 0 && this.focused === 0 && spans && !this.getTail()) {
        $event.preventDefault();
      } else {
        if (this.editor.markup) {
          this.editor.markup = $event.target.innerHTML;
          this.$refs[this.editor.id][0].classList.remove('text-greyed');
        }
      }
    }
  }
};
