export default {
  methods: {
    classToType (str) {
      return str
        .split(' ')
        .map(item => item.replace('user-story__editable--', ''))[0];
    }
  }
};
