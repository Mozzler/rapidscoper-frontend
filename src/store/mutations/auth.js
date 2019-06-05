export default {
  authenticate (state, data) {
    state.user = data;
  },
  logout (state, data) {
    state.user = data;
  }
};
