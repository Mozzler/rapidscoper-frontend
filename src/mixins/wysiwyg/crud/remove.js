export default {
  methods: {
    async removeStory () {
      this.processing = this.list[this.focused].id;

      if (this.list[this.focused].level === 0 && this.list.length === 1) {
        return;
      }

      const removable = {
        'ids': this.getSubstoryIds()
      };
      const focusable = this.$refs[this.list[this.focused - 1].id];

      await this.$store.dispatch('story/deleteMany', removable);

      this.processing = null;

      await this.$nextTick();
      focusable[0].focus();
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
