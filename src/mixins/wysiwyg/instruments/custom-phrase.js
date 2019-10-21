export default {
  data () {
    return {
      otherBuffer: ''
    };
  },
  methods: {
    declineCustomPhrase () {
      const nonSpaced = this.otherBuffer.replace(/&nbsp;|\u00a0| |/g, '');
      return !this.next || !this.next.includes('custom-') || !nonSpaced || nonSpaced === 'I';
    },
    printCustomPhrase (corrected = this.withoutSpace()) {
      if (this.declineCustomPhrase()) {
        this.otherBuffer = '';
        return;
      }

      const text = this.submitField('custom', corrected, this.focused);
      const custom = this.createSpan('other', text, false, false, true, 'i');

      this.list[this.focused].markup = this.list[this.focused].markup.replace(this.otherBuffer, custom);
      this.otherBuffer = '';

      return this.list[this.focused].markup;
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
