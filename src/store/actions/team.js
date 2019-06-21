export default {
  async createTeam (store, payload) {
    try {
      const response = await this._vm.$axios.post('team/create', payload);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
};
