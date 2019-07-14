export default {
  async create (store, payload) {
    const response = await this._vm.$axios.post(`${payload.entity}/create`, payload.data);
    const data = {
      entity: payload.entity,
      data: response.data.item
    };

    if (!payload.cancelCommit) {
      store.commit('create', data);
    }

    return response.data;
  },
  async update (store, payload) {
    const params = payload.params;
    const response = await this._vm.$axios.put(`${payload.entity}/update`, payload.data, { params });
    const data = {
      entity: payload.entity,
      data: response.data.item
    };

    store.commit('update', data);
    return response.data;
  },
  async delete (store, payload) {
    const params = {
      params: {
        id: payload.id
      }
    };

    const response = await this._vm.$axios.delete(`${payload.entity}/delete`, params);
    store.commit('delete', payload.id);
    return response.data;
  }
};
