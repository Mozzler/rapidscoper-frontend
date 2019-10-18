export default {
  nextIntroChapter (state) {
    const index = _
      .chain(state.texts)
      .keys()
      .indexOf(state.activeChapter)
      .value();

    state.activeChapter = _.keys(state.texts)[index + 1];
  }
};
