export default {
  authenticate (state, data) {
    state.user = data;
  },
  update (state, data) {
    const obj = data.items ? data.items[0] : data.data ? data.data : data;
    state.user = Object.assign(state.user, obj);
  },
  logout (state, data) {
    this._vm.$socket.disconnect();
    state.user = null;
    this.commit('entity/resetList');
  }
};
