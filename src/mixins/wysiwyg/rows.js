export default {
  methods: {
    focus (index) {
      this.focused = index;
    },
    addRowToList (parent, text = '') {
      return {
        parent: parent,
        text: text,
        estimation: null,
        priority: null,
        label: null,

        list: []
      };
    },
    createRow ($event) {
      $event.preventDefault();
      const row = this.addRowToList(this.list[this.focused].parent.parent, $event.target.outerHTML);
      this.list.push(row);
    },
    createSublist ($event) {
      if (this.level < 3) {
        const row = this.addRowToList(this.list[this.focused], '');
        this.list[this.focused].list.push(row);
      } else {
        $event.preventDefault();
      }
    },
    decreaseSublistLevel ($event) {
      $event.preventDefault();
      if (this.level > 1) {
        new Promise(resolve => {
          const node = Object.assign({}, this.list[this.focused]);
          this.list[this.focused].parent.parent.list.splice(this.focused + 1, 0, node);
          node.parent = this.list[this.focused].parent.parent;
          resolve();
        }).then(() => {
          this.list.splice(this.focused, 1);
        });
      }
    },
    remove () {
      console.log('delete');
    }
  }
};
