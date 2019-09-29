import { mapState, mapMutations } from 'vuex';

export default {
  computed: {
    ...mapState('system', [
      'comment'
    ])
  },
  methods: {
    ...mapMutations('system', [ 'setComment' ]),
    editable (str) {
      return str.replace(/contenteditable="false"/g, '');
    },
    getSpanClass (nodes, range, container = 'startContainer', offset = 'startOffset', delimeter = '') {
      // custom text
      if (range[container].previousSibling === null) {
        let text = range[container].parentNode.innerHTML.replace('&nbsp;', ' ');
        let sliced = [text.slice(0, range[offset]), text.slice(range[offset])];

        return {
          increment: 0,
          className: range[container].parentNode.className,
          updated: sliced.join(`[${delimeter}commentId=~~~]`)
        };
      }

      let editor = range[container].parentNode.className === 'user-story__editable';

      // connector between two spans - &nbsp;
      if (editor && !range[offset]) {
        return {
          increment: 1,
          className: range[container].previousElementSibling.className,
          updated: `[${delimeter}commentId=~~~]${range[container].textContent}`
        };
      }

      // beginning of the element node
      if (editor && range[offset]) {
        let next = range[container].nextSibling;
        if (next) {
          return {
            increment: 0,
            className: next.className,
            updated: `[commentId=~~~]${next.innerHTML}`
          };
        }

        let previous = range[container].previousSibling;
        if (previous) {
          return {
            increment: 1,
            className: previous.className,
            updated: `${range[container].textContent}[/commentId=~~~]`
          };
        }
      }
    },
    getCommentedMarkup (range, id) {
      let nodes = document.getElementById(id).childNodes;
      let shadowNodes = _.map(nodes, node => {
        if (node.nodeType === 3) {
          return {
            content: node.textContent
          };
        }
        if (node.nodeType === 1) {
          return {
            content: node.innerHTML,
            outerHTML: node.outerHTML,
            className: node.className
          };
        }
      });

      let markup = [
        this.getSpanClass(nodes, range),
        this.getSpanClass(nodes, range, 'endContainer', 'endOffset', '/')
      ];

      _.each(markup, item => {
        let index = _.findIndex(shadowNodes, i => i.className === item.className);
        if (shadowNodes[index + item.increment]) {
          shadowNodes[index + item.increment].content = item.updated;
        }
      });

      return _.map(shadowNodes, item => {
        if (item.outerHTML) {
          let split = item.outerHTML.split(/(<span .*>)(.*)(<\/span>)/)
            .filter(item => item);
          split[1] = item.content;

          return split.join('');
        } else {
          return item.content;
        }
      }).join('');
    },
    selectEvent ($event, id) {
      console.log($event);
      /*if (this.tab !== 'comments') {
        return;
      }

      const range = $event.view.getSelection().getRangeAt(0);
      const content = range.cloneContents();

      if (!content.childNodes.length) {
        return this.setCommentData();
      }

      let markup = this.getCommentedMarkup(range, id);
      let rect = range.getBoundingClientRect();

      this.setCommentData(id, markup, id, rect.left + 15, rect.top - 30)*/
    },
    setCommentData (id = null, markup = '', state = null, x = 0, y = 0) {
      const story = _.find(this.list, story => story.id === id);
      const data = {
        state: state,
        x: x,
        y: y,
        item: story,
        markup: id ? markup || story.markup : null,
        precomment: true,
        id: null
      };

      this.setComment(data);
    },
    commentStory (id) {
      this.setCommentData(id);
      this.$root.$emit('write-comment');
    }
  }
};
