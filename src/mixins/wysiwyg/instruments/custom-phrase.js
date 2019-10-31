export default {
  data () {
    return {
      otherBuffer: ''
    };
  },
  methods: {
    declineCustomPhrase () {
      const nonSpaced = this.otherBuffer.replace(/&nbsp;|\u00a0| |/g, '');

      const next = this.next && !this.next.includes('custom-');
      const previous = this.previous && !this.previous.includes('custom-');

      return (next && previous) || !nonSpaced || nonSpaced === 'I';
    },
    printCustomPhrase (corrected = this.withoutSpace()) {
      if (this.declineCustomPhrase()) {
        this.otherBuffer = '';
        return;
      }

      const cls = (this.previous.includes('custom-') && !this.next.includes('custom-')) ?
        this.previous : this.next;

      const text = this.submitField('custom', corrected, this.focused);
      let custom = this.createSpan('other', text, false, false, true, 'i');

      const container = document.getElementById(this.list[this.focused].id);
      const found = _.find(container.children, i =>
        i.className && i.className.includes(cls));

      if (!found) {
        const tail = this.getTail(true);
        const updated = tail.replace(this.otherBuffer, custom);
        const span = this.createSpan(this.next, updated, false, true);

        container.innerHTML = `${this.getSpanList()}&nbsp;${span}`;
      } else {
        const tail = this.getTail().replace(this.otherBuffer, custom);
        found.innerHTML += tail;
      }

      this.list[this.focused].markup = this.getSpanList();
      this.list[this.focused].placeholder = this.list[this.focused].markup;
      this.otherBuffer = '';

      this.initPlaceholder();

      this.$store.commit('entity/update', {
        entity: 'story',
        data: this.list[this.focused]
      });
    },
    async checkOtherDictionary (key, space = false) {
      const corrected = this.withoutSpace(this.otherBuffer);
      const accepted = {
        space: this.otherBuffer && space,
        capitalized: key.match(/[A-Z]/),
        letter: this.otherBuffer && key.match(/[a-z]/) && corrected === this.otherBuffer
      };

      if (_.some(accepted)) {
        this.otherBuffer += key;
        return;
      }

      this.printCustomPhrase();
    },
    withoutSpace () {
      const index = this.otherBuffer.lastIndexOf('&nbsp;');
      let result = this.otherBuffer;

      if (index !== -1 && index === this.otherBuffer.length - 6) {
        result = this.otherBuffer.slice(0, index);
      }

      return result;
    }
  }
};
