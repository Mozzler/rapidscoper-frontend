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
      if (this.tab !== 'comments') {
        return;
      }

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

      this.setComment(data);
    },
    commentStory (id) {
      let story = _.find(this.list, story => story.id === id);
      let data = {
        state: null,
        x: 0,
        y: 0,
        item: story,
        markup: story.markup
      };

      this.setComment(data);
      this.$root.$emit('write-comment');
    }
  }
};
