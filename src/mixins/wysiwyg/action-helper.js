export default {
  methods: {
    isEditable () {
      if (!this.event) {
        return false;
      }

      const focused = this.event.view.getSelection().focusNode;
      const node = focused ? this.event.view.getSelection().focusNode.parentElement : null;
      const other = this.list[this.focused] && this.list[this.focused].type === 'other';

      if (other) {
        this.list[this.focused].placeholder = this.event.target.innerHTML;
      }

      return (node && node.className.includes('custom')) || other;
    },
    completeBeginning (shortcut) {
      const item = _.find(this.adjustedConstruction, item => item.shortcut === shortcut);
      this.hintEditor = this.list[this.focused].id;
      this.hintComplete('beginning', item, this.list[this.focused].id);
    },
    printable (keycode) {
      return (keycode > 47 && keycode < 58) || // number keys
        (keycode === 32 || keycode === 13) || // spacebar & return key(s)
        (keycode > 64 && keycode < 91) || // letter keys
        (keycode > 95 && keycode < 112) || // numpad keys
        (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
        (keycode > 218 && keycode < 223);
    }
  }
};
