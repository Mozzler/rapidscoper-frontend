export default {
  updateDevice (state, data) {
    state.isMobileDevice = data;
  },
  setSidebarFilter (state, data) {
    state.storyViewMode = false;
    state.sidebarFilter = data;
  },
  setStoryViewMode (state, data) {
    state.sidebarFilter = false;
    state.storyViewMode = data;
  }
};
