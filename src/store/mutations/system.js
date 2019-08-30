export default {
  updateDevice (state, data) {
    state.isMobileDevice = data;
  },
  setSidebarFilter (state, data) {
    state.sidebarFilter = data;
  },
  setStoryViewMode (state, data) {
    state.storyViewMode = data;
  }
};
