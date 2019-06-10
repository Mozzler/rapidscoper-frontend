export default {
  beforeMount () {
    this.$root.$on('hint-complete', this.hintComplete);
  },
  beforeDestroy () {
    this.$root.$off('hint-complete');
  },
  methods: {
    focus ($event, index) {
      this.focused = index;
    },
    pressed ($event) {
      let nodes = this.$refs[`editor-${ this.focused }-${ this.level }`][0].childNodes;
      //let filtered = nodes.filter(item => item.nodeName !== '#text');
      //console.log(nodes);
      this.parseContent($event);
    },
    focusEditor (wysiwygEditor, context) {
      context.$refs[wysiwygEditor][0].focus();
    },
    addRowToList (parent, text = '') {
      return {
        parent: parent,
        estimation: null,
        priority: null,
        label: null,

        text: text,
        template: parent.template,

        list: []
      };
    },
    createRow ($event) {
      $event.preventDefault();
      new Promise(resolve => {
        const row = this.addRowToList(this.list[this.focused].parent, $event.target.outerHTML);
        this.list.push(row);
        resolve();
      }).then(() => {
        const wysiwygChild = `editor-${ this.focused + 1 }-${ this.level }`;
        this.focusEditor(wysiwygChild, this);
      });
    },
    createSublist ($event) {
      if (this.level < 3) {
        const index = this.list[this.focused].list.length;
        new Promise(resolve => {
          const row = this.addRowToList(this.list[this.focused], '');
          this.list[this.focused].list.push(row);
          resolve();
        }).then(() => {
          const wysiwygChild = `wysiwyg-child-${ this.focused }-${ this.level }`;
          const wysiwygEditor = `editor-${ index }-${ this.level + 1 }`;
          this.focusEditor(wysiwygEditor, this.$refs[wysiwygChild][0]);
        });
      } else {
        $event.preventDefault();
      }
    },
    decreaseSublistLevel ($event) {
      $event.preventDefault();
      if (this.level > 1) {
        new Promise(resolve => {
          const node = Object.assign({}, this.list[this.focused]);
          const list = node.parent.parent.list;
          list.splice(this.parentIndex + 1, 0, node);
          node.parent = node.parent.parent;
          resolve();
        }).then(() => {
          this.list.splice(this.focused, 1);
        });
      }
    },
    remove ($event) {
      const selection = $event.view.getSelection();
      const cls = selection.focusNode.parentNode.className;

      if (cls.includes('beginning')) {
        $event.preventDefault();
      }
      console.log('delete');
    }
  }
};
