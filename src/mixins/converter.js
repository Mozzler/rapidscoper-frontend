export default {
  methods: {
    getStrFromObj (item) {
      let adjusted = item;
      if (typeof adjusted === 'object') {
        adjusted = adjusted.key;
      }
      return adjusted;
    }
  }
};
