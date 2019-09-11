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
      const content = selection.getRangeAt(0).cloneContents();

      let data = {
        state: null,
        x: 0,
        y: 0,
        markup: '',
        item: null
      };

      if (content.childNodes.length) {
        const item = _.find(this.list, item => item.id === id);
        const rect = selection.getRangeAt(0).getBoundingClientRect();

        let parent = document.getElementById(`wysiwyg-${item.id}`);
        let parentRect = parent.getBoundingClientRect();

        let node = document.createElement('div');
        node.className = 'user-story__comment-item';
        _.assign(node.style, {
          left: `${rect.left - parentRect.left}px`,
          top: `${rect.top - parentRect.top - 2}px`,
          width: `${rect.width}px`
        });

        parent.prepend(node);

        _.assign(data, {
          state: id,
          x: rect.left + 15,
          y: rect.top - 30,
          item: { ...item }
        });
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
