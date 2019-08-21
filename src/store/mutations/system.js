export default {
  updateDevice (state, data) {
    state.isMobileDevice = data;
  },
  setSidebarFilter (state, data) {
    state.sidebarFilter = data;
  }
};
