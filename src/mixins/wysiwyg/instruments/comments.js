import { mapState, mapMutations } from 'vuex';

export default {
  computed: {
    ...mapState('system', [
      'comment'
    ])
  },
  methods: {
    ...mapMutations('system', [ 'setComment' ]),
    getSpanClass (nodes, range) {

    },
    selectEvent ($event, id) {
      if (this.tab !== 'comments') {
        return;
      }

      const range = $event.view.getSelection().getRangeAt(0);
      const content = range.cloneContents();

      if (!content.childNodes.length) {
        this.setCommentData(null, '', null, 0, 0);
        return;
      }
      console.log(range);

      const start = range.startContainer;
      const end = range.endContainer;

      let nodes = document.getElementById(id).childNodes;

      let chain = [];
      let markupStart = this.getSpanClass(nodes, range);

        /*_.find(this.list, story => story.id === id).markup
        .split(/<span|^&nbsp;$/)
        .map(item => item.includes('</span>') ? `<span${item}` : item)*/

      /*
      if (start && start.nodeType === 3 && start.parentNode) {
        let startSpanIndex = _.findIndex(markup, item => item.includes(start.parentNode.className));

        let matched = markup[startSpanIndex].match(/<span .*>(.*)<\/span>/)[1];
        let replaced = matched.replace(`&nbsp;`, ' '); // correction of the index position

        let unchanged = replaced.slice(0, range.startOffset);
        let changed = replaced.slice(range.startOffset);

        let regexp = new RegExp(/<(\/)?span/);
        replaced = `${unchanged}[comment-id=67]${changed}`.replace(' ', '&nbsp;');

        markup[startSpanIndex] = markup[startSpanIndex].split(/(<span .*>)(.*)(<\/span>.*)/)
          .filter(item => item)
          .map(item => !(regexp).test(item) ? replaced : item)
          .join('');
      }
      if (end && end.nodeType === 3 && end.parentNode) {
        if (end.parentNode.className === 'user-story__editable') {

        }
      }*/
    },
    setCommentData (id, markup = '', state = null, x = 0, y = 0) {
      const story = _.find(this.list, story => story.id === id);
      const data = {
        state: state,
        x: x,
        y: y,
        item: story,
        markup: markup || story.markup
      };

      this.setComment(data);
    },
    commentStory (id) {
      this.setCommentData(id);
      this.$root.$emit('write-comment');
    }
  }
};
