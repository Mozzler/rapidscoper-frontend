export default {
  filters: {
    withoutDots (str) {
      return str ? str.replace(/\.../g, '') : str;
    }
  },
  methods: {
    createSpan (type, text, greyed = false, editable = false, clickable = false) {
      const cls = `user-story__editable--${type}${greyed ? ' text-greyed' : ''}`;
      const props = `readonly contenteditable="${editable}"`;

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

      const tail = this.getTail().replace(/&nbsp;/gi, '');
      const spans = this.getSpanList(false).length;

      if ((spans === 1 || spans === 0) && !tail) {
        this.increaseSublistLevel($event);
        return;
      }

      if (this.filter && this.filter.trim()) {
        this.createField($event, true);
        return;
      }

      if (!this.next) {
        return;
      }

      if (this.next && this.next.includes('custom')) {
        this.setCustomText(true);

        let completion = this.getStaticText(1);
        if (completion && completion.includes('static-text')) {
          const [type, text] = this.getStaticTextByType(completion);
          this.editor.text = this.editor.text + this.createSpan(type, text);
        }
      }

      if (this.next.includes('static-text')) {
        const [type, text] = this.getStaticTextByType();
        this.editor.text += this.createSpan(type, text, false);
      }

      this.resetPlaceholder();
      this.updateText();
    }
  }
};
