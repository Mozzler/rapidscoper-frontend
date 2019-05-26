export default {
  updateSidebarState (state, data) {
    state.auth.minified = data;
    localStorage.setItem('minified', data);
  },
  updateDevice (state, data) {
    state.auth.isMobileDevice = data;
  }
};
