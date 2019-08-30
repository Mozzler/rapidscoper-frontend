export default {
  periods (state) {
    return _.map(state.periods, period => {
      let ms = period.replace(/\D/g, '');

      return {
        name: period,
        type: ms ? ms * 86400000 : null
      };
    });
  }
};
