export default {
  async move (store, payload) {
    const response = await this._vm.$axios.post('story/move', payload);
    console.log(response);
  }
};
