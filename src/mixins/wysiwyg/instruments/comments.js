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
      const text = selection.toString();
      let data = null;

      if (text.trim().length) {
        let rect = selection.getRangeAt(0).getBoundingClientRect();
        data = {
          state: id,
          x: rect.left,
          y: rect.top - 27,
          content: selection.toString(),
          item: this.list[this.focused]
        };
      } else {
        data = {
          state: null,
          x: 0,
          y: 0,
          content: '',
          item: null
        };
      }

      this.setComment(data);
    }
  }
};
