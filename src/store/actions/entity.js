export default {
  async getList (store, payload) {
    const response = await this._vm.$axios.get(
      payload.entity, {
        params: { 'per-page': 500, ...payload.params }
      });

    let [entity, data] = [payload.entity, response.data];
    if (entity !== 'projects') {
      entity += 's';
    }
    store.commit('setList', { entity, data });

    return response.data;
  },
  async create (store, payload) {
    const response = await this._vm.$axios.post(`${payload.entity}/create`, payload.data);

    let [entity, data] = [payload.entity+'s', response.data.item];
    store.commit('create', { entity, data });

    return response.data;
  }
};
