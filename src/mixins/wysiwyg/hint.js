export default {
  methods: {
    hideHint () {
      this.$root.$emit('hideHint-hint');
    },
    showHint (el, chapter, filter = this.filter, addresserId) {
      const rect = el.getBoundingClientRect();

      const position = {
        top: rect.top + 20,
        left: rect.left + 24
      };

      this.$nextTick(() => {
        this.hintEditor = addresserId || this.editor.id;
        this.$root.$emit('set-hint-state', true, chapter, filter, position, this.hintEditor);
      });
    },
    checkHint ($event, index) {
      this.event = $event;

      let property = $event.target.className.replace('user-story__editable--', '');

      if (this.dictionary[property]) {
        /*if ($event.type === 'dblclick') {
          $event.target.contentEditable = true;
          $event.target.innerText = '';
        }*/

        const refs = this.$refs[`editor-${this.focused}-${this.level}`];
        this.$nextTick(() => {
          refs[0].focus();
        });

        const addresserId = $event.target.parentElement.id;
        this.hideHint();
        this.showHint($event.target, property, '', addresserId);
      }
    }
  }
};
