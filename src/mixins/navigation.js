export default {
  methods: {
    toTitle (str) {
      if(str) {
        let parts = str.split('-');

        parts.forEach((item, index) => {
          parts[index] = item.charAt(0).toUpperCase() + item.substring(1);
        });

        return parts.join(' ');
      }
    },
    itemToParam (str) {
      return str.toLowerCase().replace(/ /g, '-');
    },
    goTo (item, name) {
      this.$router.push({
        name: 'dashboard',
        params: {
          name: this.itemToParam(item),
          section: name
        }
      });
    },
  }
};
