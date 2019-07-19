export default {
  async move (store, payload) {
    await this._vm.$axios.post('story/move', payload);
  }
};
