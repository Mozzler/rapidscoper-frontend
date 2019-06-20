import config from '@/config';

import Vue from 'vue';

export default {
  async createTeam (store, payload) {
    try {
      console.log(Vue.$axios);
      const response = await Vue.$axios.post('team/create', payload);
      return response.data;
    } catch (error) {
      console.log(error, 'err');
      throw new Error(error);
    }
  }
};
