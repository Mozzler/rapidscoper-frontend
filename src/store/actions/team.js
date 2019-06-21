export default {
  async createTeam (store, payload) {
    const response = await this._vm.$axios.post('team/create', payload);
    return response.data;
  }
};
