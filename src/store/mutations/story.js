export default {
  setAdjustConstructions (state, data) {
    state.adjustConstructions = data;
  },
  setActiveStoryOnTab (state, data) {
    state.activeStoryOnTab = data;
  },
  initProcessing (state, data) {
    state.processing.push(data);
  },
  updateProcessingState (state, data) {
    const index = _.findIndex(state.processing, item => item.includes(data));
    state.processing[index] = state.processing[index].filter(item => item !== data);

    if (!state.processing[index].length) {
      state.processing = state.processing.filter((arr, i) => i !== index);
    }
  }
};
