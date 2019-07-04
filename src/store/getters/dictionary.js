export default {
  constructions () {
    return {
      'As a ...': '[beginning][user-type][static-text="I can"][custom-1][static-text="so that"][custom-2]',
      'Requires a ...': '[beginning][requirement-type][static-text="called"][field]',
      'When I ...': '[beginning][custom-1][static-text="then I"][custom-2]'
    };
  },
  chapter (state, getters, rootState) {
    /*return entity => {
      return state[entity].items;
    };*/
    /*return this.$store.state.items.dictionarys.filter(item => {
      return item.type === title;
    });*/
    console.log(rootState);
  }
};
