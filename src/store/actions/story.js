import rootStore from '@/store';

export default {
  async move (store, payload) {
    await this._vm.$axios.post('story/move', payload);
  },
  async deleteMany (store, payload) {
    await this._vm.$axios.post('story/deleteMany', payload)
      .then(() => {
        rootStore.commit('entity/delete', {
          entity: 'story',
          ...payload
        });
      });
  }
};
