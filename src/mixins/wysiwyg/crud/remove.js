export default {
  data () {
    return {
      removableFlag: false
    };
  },
  methods: {
    async removeStory (index = this.focused) {
      this.processing = this.list[index].id;

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
    remove ($event) {
      this.event = $event;

      if (document.getSelection().toString()) {
        document.execCommand('delete');
        this.removableFlag = true;
        return;
      }

      if (this.isEditable()) {
        this.removableFlag = true;
        return;
      }

      if (this.list[this.focused].level > 0 && !this.getSpanList() && !this.getTail()) {
        this.decreaseStoryLevel($event);
      }

      if (this.list[this.focused].level === 0 && !this.list[this.focused].markup.length) {
        this.hintEditor = null;
        this.removeStory();
      }

      if (this.list[this.focused].markup) {
        this.removableFlag = true;
        this.$refs[this.list[this.focused].id][0].classList.remove('text-greyed');
      }
    }
  }
};
