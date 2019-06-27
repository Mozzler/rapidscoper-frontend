export default {
  async getList (store, payload) {
    const response = await this._vm.$axios.get('projects?sort=-createdAt', payload);
    store.commit('setList', response.data);
    return response.data;
  },
  async create (store, payload) {
    const response = await this._vm.$axios.post('project/create', payload);
    store.commit('create', response.data.item);
    return response.data;
  }
};
