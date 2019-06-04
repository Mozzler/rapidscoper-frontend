export default {
  authenticate (state, data) {
    console.log(state, data);
    //state = data;
  },
  logout (state, data) {
    state.user = null;
  }
};
