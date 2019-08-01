export default {
  async move (store, payload) {
    await this._vm.$axios.post('story/move', payload);
  },
  async deleteMany ({ commit }, payload) {
    await this._vm.$axios.post('story/deleteMany', payload)
      .then(() => {
        const data = {
          entity: 'story',
          ...payload
        };

        commit('entity/delete', data, { root: true });
      });
  }
};
