export default {
  update (state, payload) {
    const item = _.find(this.state.entity.dictionary.items, item => item.id === payload.id);
    _.assign(item, payload);
  }
};
