export default {
  data () {
    return {
      otherBuffer: ''
    };
  },
  methods: {
    declineCustomPhrase () {
      return !this.next || !this.next.includes('custom-') || !this.otherBuffer;
    },
    async printCustomPhrase (corrected = this.withoutSpace()) {
      if (this.declineCustomPhrase()) {
        return;
      }

      const id = this.submitField('custom', corrected, this.focused);
      const custom = this.createSpan('other', { name: corrected, id: id }, false, false, true, 'i');

      this.list[this.focused].markup = this.list[this.focused].markup.replace(this.otherBuffer, custom);
      this.otherBuffer = '';
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

      await this.printCustomPhrase();
    },
    withoutSpace () {
      const index = this.otherBuffer.lastIndexOf('&nbsp;');
      let result = this.otherBuffer;

      if (index === this.otherBuffer.length - 6) {
        result = this.otherBuffer.slice(0, index);
      }

      return result;
    },
  }
};
