export default {
  async getList (store, payload) {
    const response = await this._vm.$axios.get('team', payload);
    store.commit('setList', response.data);
    return response.data;
  },
  async create (store, payload) {
    const response = await this._vm.$axios.post('team/create', payload);
    store.commit('create', response.data.item);
    return response.data;
  }
};
