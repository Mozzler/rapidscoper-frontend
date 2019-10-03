export default {
  periods (state) {
    return _.map(state.periods, period => {
      let ms = period.replace(/\D/g, '');

      return {
        name: period,
        type: ms ? ms * 86400000 : null
      };
    });
  },
  roles (state) {
    return role => {
      const acceptableIndex = _.findIndex(state.roles, item => item.type === role);
      return {
        selected: acceptableIndex !== -1 ? state.roles[acceptableIndex] : null,
        list: _.filter(state.roles, (role, i) => i >= acceptableIndex)
      };
    };
  }
};
