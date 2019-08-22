export default {
  methods: {
    toStr (item, field) {
      if (typeof item === 'object') {
        return item[field];
      }

      return item;
    },
    isEqual (left, right, field = 'id', index) {
      if (_.isArray(left)) {
        return left.includes(index);
      }

      if (_.isObject(left) && _.isObject(right)) {
        return left[field] === right[field];
      }

      return left === right;
    }
  }
};
