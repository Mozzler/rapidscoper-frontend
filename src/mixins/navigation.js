export default {
  methods: {
    toTitle (str) {
      if (str) {
        let parts = str.split('-');

        parts.forEach((item, index) => {
          parts[index] = item.charAt(0).toUpperCase() + item.substring(1);
        });

        return parts.join(' ');
      }
    },
    itemToParam (str) {
      if (str) {
        str = str.toLowerCase().replace(/ /g, '-');
      }
      return str;
    },
    goTo (path) {
      this.$router.push(path);
    }
  }
};
