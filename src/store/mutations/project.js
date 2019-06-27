export default {
  setList (state, data) {
    state.projects = data;
  },
  create (state, data) {
    const existed = state.projects.items.filter(item => {
      return item.id === data.id;
    });

    if (!existed.length) {
      state.projects.items.push(data);
    }
  },
  update (state, data) {
    state.projects.items.forEach((item, index) => {
      if (item.id === data.id) {
        state.projects[index] = Object.create(data);
      }
    });
  }
};
