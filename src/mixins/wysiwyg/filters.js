export default {
  beforeMount () {
    this.setConstructions();
  },
  computed: {
    dictionary () {
      return this.$store.getters['story/dictionary'];
    },
    threshold () {
      return this.getEquation();
    }
  },
  methods: {
    getEquation (level = this.editor ? this.editor.level : null) {
      switch (level) {
        case 0:
          return '=== 0';
        case 1:
          return '> -1';
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
          value: list[item].structure,
          type: list[item].type
        };
      });
    },
    setConstructions () {
      let constructions = this.getAdjusted();
      this.$store.commit('story/setAdjustConstructions', constructions);
    }
  },
  watch: {
    focused () {
      this.setConstructions();
    }
  }
};
