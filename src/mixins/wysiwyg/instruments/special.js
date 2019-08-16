export default {
  methods: {
    setText (text) {
      _.assign(this.list[this.focused], {
        markup: text,
        placeholder: text,
        type: 'other',
        template: ''
      });
      this.collapseToEnd();
    },
    ctrlV ($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $event.target.classList.remove('text-dark-grey');
      navigator.clipboard.readText()
        .then(text => {
          $event.target.innerHTML = text;
          this.setText(text);
        });
    },
  }
}
