export default {
  methods: {
    async removeStory () {
      this.processing = this.editor.id;
      this.hideHint();

      if (this.editor.level === 1 && this.list.length === 1) {
        return;
      }

      const previousId = _.findIndex(this.list, item => item.id === this.editor.id);
      await this.$store.dispatch('entity/delete', {
        entity: 'story',
        id: this.editor.id
      });

      this.$nextTick(() => {
        this.$refs[this.list[previousId].id][0].focus();
        this.processing = null;
      });
    },
    async remove ($event, item) {
      this.event = $event;
      this.editor = item;

      // allow to remove characters from editable div
      if (this.isEditable()) {
        return;
      }

      if (!this.editor) {
        return;
      }

      const spans = this.editor.markup.split('</span>');

      if (this.editor.level > 0 && !this.getSpanList() && !this.getTail()) {
        await this.decreaseStoryLevel($event);
      }

      const spanList = this.getSpanList(false);
      if (this.editor.level === 0 && spanList.length === 1 && !this.getTail()) {
        this.removeStory();
      }

      if (this.editor.level === 0 && spans[1] === '&nbsp;') {
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
