export default {
  methods: {
    toStr (item, field) {
      if (_.isObject(item)) {
        return item[field];
      }

      return item;
    },
    isEqual (left, right, field = 'id', index) {
      if (_.isArray(left)) {
        return left.includes(index) || left.includes(right);
      }

      if (_.isObject(left) && _.isObject(right)) {
        return left[field] === right[field];
      }

      return left === right;
    }
  }
};
