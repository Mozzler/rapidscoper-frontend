export default {
  setList (state, data) {
    state.teams = data;
  },
  create (state, data) {
    const existed = state.teams.items.filter(item => {
      return item.id === data.id;
    });

    if (!existed.length) {
      state.teams.items.push(data);
    }
  },
  update (state, data) {
    state.teams.items.forEach((item, index) => {
      if (item.id === data.id) {
        state.teams[index] = Object.create(data);
      }
    });
  },
};
