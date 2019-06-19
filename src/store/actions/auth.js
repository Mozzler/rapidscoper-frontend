import config from '@/config';

import Vue from 'vue';

export default {
  async signup (state, payload) {
    const response = await Vue.$axios.post('user/create', payload);

    if (!response.data.error) {
      state.commit('authenticate', response.data);
    }

    return response.data;
  },
  async login (state, payload) {
    const data = {
      username: payload.email,
      password: payload.password,
      client_id: config.CLIENT_ID,
      client_secret: config.CLIENT_SECRET,
      response_type: 'token',
      grant_type: 'password'
    };

    const response = await Vue.$axios.post('user/token', data);

    if (!response.data.error) {
      state.commit('authenticate', response.data);
    }

    return response.data;
  },
  async updateUserInfo (state, payload) {
    const id = state.auth.user;
    const url = `user/update?id=${id}`;
    const response = await Vue.$axios.put(url, payload);

    if (!response.data.error) {
      state.commit('authenticate', response.data);
    }

    return response.data;
  },
  logout (state) {
    state.commit('logout', null);
  }
};
