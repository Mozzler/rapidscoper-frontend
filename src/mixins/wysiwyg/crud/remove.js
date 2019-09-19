export default {
  methods: {
    async removeStory (index = this.focused) {
      this.processing = this.list[index].id;

      if (this.list[index].level === 0 && this.list.length === 1) {
        return;
      }

      const removable = {
        'ids': this.getSubstoryIds(index)
      };

      const focusable = index ? this.$refs[this.list[index - 1].id] :
        this.list.length > 1 ? this.$refs[this.list[index + 1].id] : null;

      await this.$store.dispatch('story/deleteMany', removable);
      this.processing = null;

      await this.$nextTick();

      if (focusable !== null) {
        focusable[0].focus();
      }

      this.collapseToEnd();
    },
    async remove ($event) {
      this.event = $event;

      // allow to remove characters from editable div
      if (this.isEditable()) {
        return;
      }

      if (this.list[this.focused].level > 0 && !this.getSpanList() && !this.getTail()) {
        await this.decreaseStoryLevel($event);
      }

      if (this.list[this.focused].level === 0 && !this.list[this.focused].markup.length) {
        this.hintEditor = null;
        this.removeStory();
      }

      const spans = this.getSpanList(false).length === 1;
      if (this.list[this.focused].level === 0 && this.focused === 0 && spans && !this.getTail()) {
        $event.preventDefault();
      } else {
        if (this.list[this.focused].markup) {
          this.list[this.focused].markup = $event.target.innerHTML;
          this.$refs[this.list[this.focused].id][0].classList.remove('text-greyed');
        }
      }

      this.collapseToEnd();
    }
  }
};
