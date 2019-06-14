export default {
  filters: {
    withoutDots (str) {
      return str ? str.replace(/\.../g, '') : str;
    }
  },
  methods: {
    createSpan (type, text, greyed = false) {
      const cls = `user-story__editable--${type}${greyed ? ' text-greyed' : ''}`;
      const props = `readonly contenteditable="false"`;

      return `<span class="${cls}" ${props}>${ this.$options.filters.withoutDots(text) }</span>&nbsp;`;
    },
    resetPlaceholder () {
      this.editor.tail = '';
      this.editor.placeholder = this.editor.text;
    },
    fixStaticText ($event) {
      $event.preventDefault();
      this.event = $event;
      this.setSiblings();

      if (this.filter && this.filter.trim()) {
        this.$root.$emit('complete-hint', this.filter, true);
        return;
      }

      if (this.next === 'custom') {
        this.setCustomText();

        if (this.editor.tail) {
          this.editor.text += this.editor.tail;
          this.resetPlaceholder();
        }
      }

      if (this.editor.tail && this.next.includes('static-text')) {
        const content = this.next.replace(/static-text=|"/g, '');
        this.editor.text += this.createSpan('static-text', content, false, false);
        this.resetPlaceholder();
      }

      /*
      if (this.editor.tail && this.next.includes('static-text')) {
        const content = this.next.replace(/static-text=|"/g, '');
        this.editor.text += this.editor.tail;//this.createSpan('static-text', content, false, false);
        this.resetPlaceholder();
      }*/

      this.updateText();
    }
  }
};
