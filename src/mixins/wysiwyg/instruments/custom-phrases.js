export default {
  data () {
    return {
      otherBuffer: ''
    };
  },
  methods: {
    async writeFromOtherBuffer (corrected = this.withoutSpace(this.otherBuffer)) {
      if (this.otherBuffer) {
        return;
      }
      const id = this.getObjectId();
      const custom = this.createSpan('other', { name: corrected, id: id }, false, false, true, id);

      this.list[this.focused].markup = this.list[this.focused].markup.replace(this.otherBuffer, custom);

      await this.submitField('custom', corrected, this.focused, id);
      this.otherBuffer = '';
    },
    withoutSpace () {
      const index = this.otherBuffer.lastIndexOf('&nbsp;');
      let result = this.otherBuffer;

      if (index === this.otherBuffer.length - 6) {
        result = this.otherBuffer.slice(0, index);
      }

      return result;
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

      await this.writeFromOtherBuffer(corrected);
    }
  }
};
