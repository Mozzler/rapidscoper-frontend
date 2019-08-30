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
  },
  async update (store, payload) {
    let params = {
      params: payload.params
    };

    const response = await this._vm.$axios.put('project-share/update', payload.data, params);
    return response.data;
  },
  async view (store, payload) {
    try {
      const response = await this._vm.$axios.get('project/snapshot', payload);
      store.commit('setProjectSnapshot', response.data);
      return response.data;
    } catch (error) {
      return Promise.reject(error.response);
    }
  }
};
