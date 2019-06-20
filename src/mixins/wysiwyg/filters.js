export default {
  beforeMount () {
    this.setConstructions();
  },
  computed: {
    dictionary () {
      return this.$store.state.story.dictionary;
    },
    threshold () {
      return this.getEquation();
    }
  },
  methods: {
    getEquation (level = this.level) {
      switch (level) {
        case 1:
          return '=== 0';
        default:
          return '> 0';
      }
    },
    getAdjusted (threshold = this.threshold) {
      const list = this.dictionary.constructions;
      const keys = Object.keys(list).filter((item, index) => {
        return eval(index + threshold);
      });

      return keys.map((item, index) => {
        return {
          key: item,
          value: list[item]
        };
      });
    },
    setConstructions () {
      let constructions = this.getAdjusted();
      this.$store.commit('setAdjustConstructions', constructions);
    }
  },
  watch: {
    focused () {
      this.setConstructions();
    }
  }
};
