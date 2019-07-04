export default {
  setList (state, payload) {
    state[payload.entity] = payload.data;
  },
  create (state, payload) {
    const existed = state[payload.entity].items.filter(item => {
      return item.id === payload.data.id;
    });

    const teamId = (state.activeTeamId === payload.data.teamId) || (state.activeTeamId === null);
    const allowedTeamId = payload.entity === 'projects' ? teamId : true;

    if ((!existed.length && allowedTeamId) || !payload.data.id) {
      // const strategy = payload.entity === 'projects' ? 'unshift' : 'push';
      state[payload.entity].items['push'](payload.data);
    }
  },
  update (state, payload) {
    state[payload.entity].items.forEach((item, index) => {
      if (item.id === payload.data.id) {
        let obj = state[payload.entity].items[index];
        Object.assign(obj, payload.data);
      }
    });
  },
  setActiveId (state, payload) {
    let [type, value] = payload;
    state[`active${type}Id`] = value;
  },
};
