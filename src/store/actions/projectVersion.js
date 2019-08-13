export default {
  async post (store, payload) {
    try {
      const response = await this._vm.$axios.post('project-version/versionSnapshot', payload);
      store.commit('setProjectVersion', response.data);
      return response.data;
    } catch (error) {
      return Promise.reject(error.response);
    }
  },
  async share (store, payload) {
    const response = await this._vm.$axios.post('project-share/create', payload);
    return response.data;
  }
};
