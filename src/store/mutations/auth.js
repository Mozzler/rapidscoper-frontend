function converter (data) {
  let obj = data.items ? data.items[0] : data;
  obj = obj.data ? obj.data : obj;
  return obj;
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
