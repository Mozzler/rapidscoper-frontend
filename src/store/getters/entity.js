export default {
  items (state) {
    return entity => {
      return state[entity].items;
    };
  }
};
