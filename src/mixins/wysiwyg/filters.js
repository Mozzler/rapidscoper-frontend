export default {
  beforeMount () {
    this.setConstructions();
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
    getAdjusted () {
      const list = this.dictionary.constructions;
      const keys = Object.keys(list).filter((item, index) => {
        return eval(index + this.threshold);
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
