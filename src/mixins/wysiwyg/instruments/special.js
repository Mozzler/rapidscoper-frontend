export default {
  methods: {
    setText (text) {
      this.list[this.focused].markup += text;
      this.list[this.focused].placeholder += text;

      if (!this.list[this.focused].type) {
        this.list[this.focused].type = 'other';
        this.list[this.focused].template = '';
      }

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
    }
  }
};
