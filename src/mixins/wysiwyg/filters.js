export default {
  beforeMount () {
    this.setBeginnings();
  },
  computed: {
    dictionary () {
      return this.$store.state.story.dictionary;
    },
    threshold () {
      switch (this.level) {
        case 1:
          return '=== 0';
        case 3:
          return '> 0';
        default:
          return '> -1';
      }
    }
  },
  methods: {
    getAdjusted (type) {
      return this.dictionary[type].filter((item, index) => {
        return eval(index + this.threshold);
      });
    },
    setBeginnings () {
      let beginning = this.getAdjusted('beginning');
      this.$store.commit('setAdjustBeginning', beginning);
    }
  },
  watch: {
    level () {
      this.setBeginnings();
    }
  }
};
