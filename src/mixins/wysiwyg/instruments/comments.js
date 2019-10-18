import ShardMixin from './shards';

import { mapState, mapMutations } from 'vuex';

const COMMENT_LEFT = '[commentId=~~~]';
const COMMENT_RIGHT = '[/commentId=~~~]';

export default {
  mixins: [
    ShardMixin
  ],
  computed: {
    ...mapState('system', [
      'comment'
    ])
  },
  mounted () {
    this.highlightComments();
  },
  methods: {
    ...mapMutations('system', [ 'setComment' ]),
    editable (str) {
      return str.replace(/contenteditable="false"/g, '');
    },
    highlightComments () {
      _.each(this.stories, story => {
        this.createCommentNodes(story.id);
      });
    },
    findCommentNodes (nodes, i = 0) {
      let ranges = [];

      for (; i < nodes.length; i++) {
        const beginning = nodes[i].textContent.match(/\[commentId=.*?\]/i);

        if (beginning) {
          const id = beginning[0].replace(/\[commentId=|\]/g, '');
          const startIndex = nodes[i].textContent.indexOf(`[commentId=${id}]`);
          nodes[i].textContent = nodes[i].textContent.replace(`[commentId=${id}]`, '');

          let endIndex = null;
          let found = null;
          let j = i;

          for (; j < nodes.length; j++) {
            found = nodes[j].textContent.indexOf(`[/commentId=${id}]`);
            if (found !== -1) {
              endIndex = found - 1;
              nodes[j].textContent = nodes[j].textContent.replace(`[/commentId=${id}]`, '');
              break;
            }
          }

          const range = document.createRange();

          if (!nodes[i] || !nodes[j]) {
            return;
          }

          const startNode = nodes[i].nodeType === 1 ?
            _.first(nodes[i].childNodes) : nodes[i];
          range.setStart(startNode, startNode.length ? startIndex : 0);

          const endNode = nodes[j].nodeType === 1 ?
            _.first(nodes[j].childNodes) : nodes[j];
          range.setEnd(endNode, endNode.length ? endIndex + 1 : 0);

          ranges.push(range);
        }
      }

      return ranges;
    },
    createCommentNodes (id) {
      const nodes = document.getElementById(`comment-${id}`).childNodes;
      const ranges = this.findCommentNodes(nodes);

      _.each(ranges, range => {
        const parent = document.getElementById(`comment-container-${id}`);
        const parentRect = parent.getBoundingClientRect();
        const rect = range.getBoundingClientRect();

        let n = document.createElement('div');
        n.className = 'user-story__comment-item';
        _.assign(n.style, {
          left: `${rect.left - parentRect.left}px`,
          top: `${rect.top - parentRect.top - 2}px`,
          width: `${rect.width}px`
        });

        parent.prepend(n);
      });
    },
    getSpanClass (nodes, range, container = 'startContainer', offset = 'startOffset', delimeter = '') {
      // custom text
      if (range[container].previousSibling === null) {
        let text = range[container].parentNode.innerHTML.replace(/&nbsp;|\u00a0/g, ' ');
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

      const markup = [
        this.getSpanClass(nodes, range),
        this.getSpanClass(nodes, range, 'endContainer', 'endOffset', '/')
      ];

      if (markup[0].className !== markup[1].className) {
        _.each(markup, item => {
          let index = _.findIndex(shadowNodes, i => i.className === item.className);
          if (shadowNodes[index + item.increment]) {
            shadowNodes[index + item.increment].content = item.updated;
          }
        });
      } else {
        const beginning = markup[0].updated.split('[commentId=~~~]');
        const ending = markup[1].updated.split(beginning[0]);

        let index = _.findIndex(shadowNodes, i => i.className === markup[0].className);
        shadowNodes[index].content = `${beginning[0]}[commentId=~~~]${ending[1]}`;
      }

      const originalMarkup = _.find(this.stories, story => story.id === id).originalMarkup;
      const updatedMarkup = _.map(shadowNodes, item => {
        if (item.outerHTML) {
          let split = item.outerHTML.split(/(<span .*>)(.*)(<\/span>)/)
            .filter(item => item);
          split[1] = item.content;

          return split.join('');
        } else {
          return item.content;
        }
      }).join('');

      return this.stick(originalMarkup, updatedMarkup);
    },
    calculateXY (hint, target, id) {
      const phraseRect = target.getBoundingClientRect();
      const wysiwygRect = document.getElementById(`wysiwyg-${id}`)
        .getBoundingClientRect();

      const x = (phraseRect.width - hint.clientWidth) / 2;
      const y = hint.clientHeight;

      _.assign(hint.style, {
        position: 'absolute',
        top: `${phraseRect.top - wysiwygRect.top - 5 - y}px`,
        left: `${phraseRect.left - wysiwygRect.left + x}px`
      });
    },
    selectEvent ($event, id) {
      if (this.tab !== 'comments') {
        return;
      }

      const range = $event.view.getSelection().getRangeAt(0);
      const content = range.cloneContents();

      if (!content.childNodes.length) {
        return this.setCommentData();
      }

      const hint = document.getElementById(`comment-${id}`);
      const markup = this.getCommentedMarkup(range, id);

      this.calculateXY(hint, range, id);
      this.setCommentData(id, markup, id);
    },
    setCommentData (id = null, markup = '', state = null, x = 0, y = 0, parentCommentId = null) {
      const story = _.find(this.list, story => story.id === id);
      const data = {
        state: state,
        x: x,
        y: y,
        item: story,
        markup: id ? markup || story.markup : null,
        precomment: true,
        id: parentCommentId
      };

      this.setComment(data);
    },
    commentStory (id, markup) {
      const storyRegex = /^\[commentId=.*\].*\[\/commentId=.*\]$/gi;

      if (markup.match(storyRegex)) {
        let commentId = markup.match(/\[commentId=(.*?)\]/i);
        this.setCommentData(id, markup, null, 0, 0, commentId[1]);
      } else {
        let commentedMarkup = `${COMMENT_LEFT}${markup}${COMMENT_RIGHT}`;
        this.setCommentData(id, commentedMarkup);
      }

      this.$root.$emit('write-comment');
    }
  },
  updated () {
    this.highlightComments();
  }
};
