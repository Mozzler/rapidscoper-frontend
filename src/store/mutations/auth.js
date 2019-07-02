export default {
  authenticate (state, data) {
    state.user = data;
  },
  update (state, data) {
    const obj = data.data ? data.data : data;
    state.user = Object.assign(state.user, obj);
  },
  logout (state, data) {
    state.user = data;
  }
};
