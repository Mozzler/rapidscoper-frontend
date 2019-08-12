export default {
  async post (store, payload) {
    const response = await this._vm.$axios.post('project-version/versionSnapshot', payload);
    store.commit('setProjectVersion', response.data);
    return response.data;
  },
  async share (store, payload) {
    const response = await this._vm.$axios.post('project-share/create', payload);
    return response.data;
  }
};
