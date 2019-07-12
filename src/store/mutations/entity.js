export default {
  setList (state, payload) {
    payload.data.items = payload.data.items.map(item => {
      item.id = item._id ? item._id : item.id;
      return item;
    });
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
  delete (state, payload) {
    state[payload.entity].items = state[payload.entity].items.filter((item) => {
      return item.id !== payload.zid;
    });
  },
  setActiveId (state, payload) {
    let [type, value] = payload;
    state[`active${type}Id`] = value;
  },
  resetList (state, payload) {
    const empty = {
      items: [],
      _links: null,
      _meta: null
    };

    if (payload) {
      state[payload.entity] = empty;
    } else {
      Object.keys(state).forEach(key => {
        state[key] = empty;
      });
    }
  }
};
