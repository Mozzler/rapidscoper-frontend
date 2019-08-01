import Vue from 'vue';
import { CLIENT_ID, CLIENT_SECRET } from '../config';

export default {
  async login(username, password) {
    const data = {
      username,
      password,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      response_type: 'token',
      grant_type: 'password'
    };
    
    const response = await Vue.$axios.post('v1/user/token', data);
    return response.data;
  },
  async checkToken() {
    try {
      const response = await Vue.$axios.get('v1/users');
      return response.data.items[0];
    } catch(err) {
      return null;
    }
  },
  async refreshToken() {
    try {
      const data = {
        username: localStorage.getItem('username'),
        refresh_token: localStorage.getItem('refresh_token'),
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        response_type: 'token',
        grant_type: 'refresh_token'
      }
      const response = await Vue.$axios.post('v1/user/token', data);
      return response.data;
    } catch(err) {
      return null;
    }
  },
  async create(model_name, data) {
    const response = await Vue.$axios.post(models[model_name].endpoints.create, data);
    return response.data;
  },
};
