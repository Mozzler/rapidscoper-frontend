export default {
  setAdjustConstructions (state, data) {
    state.adjustConstructions = data;
  },
  setActiveStoryOnTab (state, data) {
    state.activeStoryOnTab = data;
  },
  setToolProcessing (state, data) {
    state.toolProcessing = data;
  },
  updateFilters (state, data) {
    state.filters[data.type] = data.set;
  }
};
