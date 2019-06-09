export default {
  computed: {
    dictionary () {
      return this.$store.state.story.dictionary;
    }
  },
  methods: {
    hintComplete (chapter, text, el) {
      if (this.$refs[el]) {
        this.$refs[el][0].focus();
        this.list[this.focused].text += this.setStaticText(chapter, text);

        this.updateText();
      }
    },
    setStaticText (type, text, greyed = false) {
      return `<span class="user-story__editable--${type} ${greyed ? 'text-greyed' : ''}">${text}</span>&nbsp;`;
    },
    initLine (editor) {
      return new Promise(resolve => {
        if (!editor.text.trim()) {
          if (this.level > 1) {
            editor.template = this.dictionary.constructions[3];
          } else {
            editor.text = this.setStaticText('beginning', 'As a');
            editor.template = this.dictionary.constructions[0];
          }
        }
        resolve();
      });
    },
    fixStaticText ($event) {
      $event.preventDefault();
      this.list[this.focused].text = this.list[this.focused].text.replace(' text-greyed', '');
      this.updateText();
    },
    parseContent ($event) {
      const editor = this.list[this.focused];
      this.initLine(editor)
        .then(() => {
          /*const cursorPosition = document.getSelection().anchorOffset;
          const substr = editor.template.substring(0, cursorPosition);*/
          const spans = editor.text.split('<span ').filter(item => !!item);
          const type = spans[spans.length - 1].match(/class="user-story__editable--([^"]*)/).map(item => item.trim());

          const start = editor.template.indexOf(type[1].trim());
          const end = editor.template.indexOf(']', start);

          const tail = editor.template.substr(end + 2);
          const remainder = tail
            .split(/[[(.+?)\]]/g)
            .filter(item => !!item.trim())[0];

          if (remainder.includes('custom')) {
            this.list[this.focused].text += this.setStaticText(remainder, this.dictionary[remainder][0], true);
            this.updateText();
            return;
          }

          if (remainder.includes('static-text')) {
            const [cls, text] = remainder
              .split('=')
              .map(item => item.replace(/[|]|"/g,''));
            this.list[this.focused].text += this.setStaticText(cls, text, true);

            this.updateText();
          } else {
            const chapter = remainder.replace('text-greyed', '').trim();
            if (this.dictionary[chapter]) {
              const input = `editor-${ this.focused }-${ this.level }`;
              this.$root.$emit('set-hint-state', true, chapter, '', input);
            }
          }
        });
    }
  }
};
