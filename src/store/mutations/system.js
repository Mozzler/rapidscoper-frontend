export default {
  updateSidebarState(state, data) {
    state.auth.minified = data;
    localStorage.setItem('minified', data);
  }
};
