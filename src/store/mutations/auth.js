function converter (data) {
  let obj = _.has(data, 'data') ? data.data : data;
  return _.has(obj, 'items') ? obj.items[0] : obj;
}

export default {
  authenticate (state, data) {
    state.user = data;
  },
  update (state, data) {
    state.user = _.assign(state.user, converter(data));
  },
  logout (state, data) {
    this._vm.$socket.disconnect();
    state.user = null;
    this.commit('entity/resetList');
  }
};
