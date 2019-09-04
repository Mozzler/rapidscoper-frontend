import { mapState, mapMutations } from 'vuex';

export default {
  computed: {
    ...mapState('system', [
      'comment'
    ])
  },
  methods: {
    ...mapMutations('system', [ 'setComment' ]),
    selectEvent ($event, id) {
      const selection = $event.view.getSelection();
      let data = null;

      let content = selection.getRangeAt(0).cloneContents();

      if (content.childNodes.length) {
        let rect = selection.getRangeAt(0).getBoundingClientRect();
        let markup = '';

        _.each(content.childNodes, node => {
          if (node.nodeType === 1) {
            markup += node.outerHTML;
          }
          if (node.nodeType === 3) {
            markup += node.textContent;
          }
        });

        data = {
          state: id,
          x: rect.left + 15,
          y: rect.top - 30,
          item: this.list[this.focused],
          markup: markup.replace(/  +/g, '&nbsp;')
        };
      } else {
        data = {
          state: null,
          x: 0,
          y: 0,
          markup: '',
          item: null
        };
      }

      console.log(data.markup);
      this.setComment(data);
    }
  }
};
