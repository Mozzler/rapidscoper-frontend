import config from '@/config';

export default {
  async signup (state, payload) {
    try {
      const response = await this._vm.$axios.post('user/create', payload);

      if (!response.data.error) {
        state.commit('authenticate', response.data.item);
      }

      return response.data;
    } catch (error) {
      const data = error.response.data;
      if (data[0].field === 'uniqueUsername') {
        throw new Error('The email address is already in use');
      }
    }
  },
  async login (store, payload) {
    const data = {
      username: payload.email,
      password: payload.password,
      client_id: config.CLIENT_ID,
      client_secret: config.CLIENT_SECRET,
      response_type: 'token',
      grant_type: 'password'
    };

    const response = await this._vm.$axios.post('user/token', data);

    if (!response.data.error) {
      store.commit('authenticate', response.data);
    }

    return response.data;
  },
  async updateUserInfo (store, payload) {
    const id = store.state.user.user_id;
    const url = `user/update?id=${id}`;
    const response = await this._vm.$axios.put(url, payload);

    if (!response.data.error) {
      store.commit('update', response.data.item);
    }

    return response.data;
  },
  logout (store) {
    store.commit('logout', null);
  }
};
