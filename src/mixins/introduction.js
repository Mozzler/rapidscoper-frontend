import * as C from '../constants/introduction';

import { mapState } from 'vuex';

export default {
  data () {
    return { C };
  },
  computed: {
    ...mapState('introduction', [
      'activeChapter'
    ])
  },
  methods: {
    checkActiveChapter (key) {
      return this.activeChapter === key;
    }
  }
};
