function filter (entity, data) {
  const exceptions = ['story', 'projects', 'dictionary'];

  if (!exceptions.includes(entity)) {
    entity += 's';
  }
  return { entity, data };
}

export default {
  async read (store, payload) {
    const response = await this._vm.$axios.get(
      payload.entity, {
        params: { 'per-page': 500, ...payload.params }
      });
    const data = filter(payload.entity, response.data);

    store.commit('setList', data);
    return response.data;
  },
  async create (store, payload) {
    const response = await this._vm.$axios.post(`${payload.entity}/create`, payload.data);
    const data = filter(payload.entity, response.data.item);

    store.commit('create', data);
    return response.data;
  },
  async update (store, payload) {
    const params = payload.params;
    const response = await this._vm.$axios.put(`${payload.entity}/update`, payload.data, { params });
    const data = filter(payload.entity, response.data.item);

    store.commit('update', data);
    return response.data;
  },
  async delete (store, payload) {
    const response = await this._vm.$axios.delete(`${payload.entity}/delete`, null, { params: payload });
    store.commit('delete', payload);
    return response.data;
  }
};
