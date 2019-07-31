export default {
  methods: {
    resetPlaceholder () {
      this.list[this.focused].tail = '';
      this.list[this.focused].placeholder = this.list[this.focused].markup;
    },
    increasable () {
      const tail = this.getTail().replace(/&nbsp;/gi, '');
      const spans = this.getSpanList(false).length;
      const parentExists = this.focused !== 0 &&
        this.list[this.focused - 1].level === this.list[this.focused].level;

      return (spans === 1 || spans === 0) && !tail && parentExists;
    },
    fixStaticText ($event) {
      $event.preventDefault();
      this.event = $event;
      this.setSiblings();

      if (this.increasable()) {
        return this.increaseStoryLevel($event);
      }

      if (this.filter && this.filter.trim()) {
        return this.createField($event, true);
      }

      if (!this.next) {
        return;
      }

      if (this.next && this.next.includes('custom')) {
        this.setCustomText(true);

        let completion = this.getStaticText(1);
        if (completion && completion.includes('static-text')) {
          const [type, text] = this.getStaticTextByType(completion);
          this.list[this.focused].markup = this.list[this.focused].markup + this.createSpan(type, text);
        }
      }

      if (this.next.includes('static-text')) {
        const [type, text] = this.getStaticTextByType();
        this.list[this.focused].markup += this.createSpan(type, text, false);
      }

      this.resetPlaceholder();
      this.collapseToEnd();
    }
  }
};
