function converter (data) {
  return Array.isArray(data) ? data[0] : data.data ? data.data : data;
}

export default {
  authenticate (state, data) {
    state.user = data;
  },
  update (state, data) {
    const obj = converter(data);
    state.user = Object.assign(state.user, obj);
  },
  logout (state, data) {
    this._vm.$socket.disconnect();
    state.user = null;
    this.commit('entity/resetList');
  }
};
