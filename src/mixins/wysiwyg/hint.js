export default {
  methods: {
    hideHint () {
      this.$root.$emit('hideHint-hint');
    },
    showHint (el, chapter, filter = this.filter) {
      const rect = el.getBoundingClientRect();

      const position = {
        top: rect.top + 20,
        left: rect.left + 24
      };

      this.$nextTick(() => {
        const addresserId = this.$refs[this.ref][0].id;
        this.$root.$emit('set-hint-state', true, chapter, filter, this.ref, position, addresserId);
      });
    },
    checkHint ($event) {
      this.event = $event;

      let property = $event.target.className.replace('user-story__editable--', '');

      if (this.dictionary[property]) {
        /*if ($event.type === 'dblclick') {
          $event.target.contentEditable = true;
          $event.target.innerText = '';
        }*/

        this.hideHint();
        this.showHint($event.target, property, '');
      }
    }
  }
};
