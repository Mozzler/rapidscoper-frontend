function normalizeId (data) {
  if (_.isArray(data)) {
    return _.map(data, item => {
      item.id = item._id ? item._id : item.id;
      return item;
    });
  }
  if (_.isObject(data)) {
    data.id = data._id ? data._id : data.id;
    return data;
  }
}

export default {
  setList (state, payload) {
    payload.data.items = normalizeId(payload.data.items);
    state[payload.entity] = payload.data;
  },
  create (state, payload) {
    payload.data = normalizeId(payload.data);
    const existed = _.filter(state[payload.entity].items, item => item.id === payload.data.id);

    if (!existed.length) {
      state[payload.entity].items.push(payload.data);
    }
  },
  update (state, payload) {
    const entity = payload.actual ? payload.actual : payload.entity;
    payload.data = normalizeId(payload.data);

    _.each(state[entity].items, (item, index) => {
      if (item.id === payload.data.id) {
        _.assign(state[payload.entity].items[index], payload.data);
      }
    });
  },
  delete (state, payload) {
    if (!payload.entity) {
      return;
    }
    state[payload.entity].items = _.filter(state[payload.entity].items,
        item => item.id !== payload.id);
  },
  resetList (state, entity) {
    if (entity) {
      state[entity].items = [];
    } else {
      _.each(state, (val, key) => {
        state[key].items = [];
      });
    }
  }
};
