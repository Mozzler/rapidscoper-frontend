export default {
  setList (state, payload) {
    state[payload.entity] = payload.data;
  },
  create (state, payload) {
    const existed = state[payload.entity].items.filter(item => {
      return item.id === payload.data.id;
    });

    if (!existed.length) {
      state[payload.entity].items.push(payload.data);
    }
  },
  update (state, payload) {
    state[payload.entity].items.forEach((item, index) => {
      if (item.id === payload.data.id) {
        state[payload.entity][index] = Object.create(payload.data);
      }
    });
  },
};
