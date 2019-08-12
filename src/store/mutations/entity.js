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

function toCamelCase (str) {
  return str.split('-').map((item, index) => {
    let modified = item.charAt(0).toUpperCase() + item.slice(1);
    return index !== 0 ? modified : item;
  }).join('');
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
        _.assign(item, payload.data);
      }
    });
  },
  delete (state, payload) {
    let deletable = [];

    if (payload.id) {
      deletable = [payload.id];
    }
    if (payload.ids) {
      deletable = payload.ids;
    }

    let normalized = toCamelCase(payload.entity);

    state[normalized].items = _.filter(state[normalized].items,
        item => !deletable.includes(item.id));
  },
  resetList (state, entity) {
    if (_.isString(entity)) {
      state[entity].items = [];
    } else
    if (_.isArray(entity)) {
      _.each(entity, val => {
        state[val].items = [];
      });
    } else
    if (!entity) {
      _.each(state, (val, key) => {
        state[key].items = [];
      });
    }
  }
};
