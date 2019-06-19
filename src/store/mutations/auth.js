export default {
  authenticate (state, data) {
    state.user = data;
  },
  update (state, data) {
    state.user = Object.assign(state.user, data);
  },
  logout (state, data) {
    state.user = data;
  }
};
