export default {
  async create (store, payload) {
    const response = await this._vm.$axios.post('project/create', payload);
    store.commit('create', response.data.item);
    return response.data;
  }
};
