/*
const actions = {
  [AUTH_LOGIN]: async ({ commit }, { email, password }) => {
    try {
      const {
        access_token,
        refresh_token,
        user_id,
        username
      } = await API.login(email, password);

      if (access_token) {
        Vue.$socket.init();

        commit(CHANGE_AUTHENTICATED, true);
        commit(CHANGE_USER, {user_id, username});
        localStorage.setItem('token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('username', username);
        localStorage.setItem('user_id', user_id);
      }
    } catch (e) {
      //handle error
    }
  },
  [AUTH_LOGOUT]: ({ commit }) => {
    Vue.$socket.close();

    commit(CHANGE_AUTHENTICATED, false);
    commit(CHANGE_USER, {username: null, user_id: null});
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
  },
  [CHECK_TOKEN]: async () => {
    return await API.checkToken();
  },
  [REFRESH_TOKEN]: async () => {
    const tokenResult = await API.refreshToken();

    if (tokenResult && tokenResult.access_token) {
      localStorage.setItem('token', tokenResult.access_token);
       localStorage.setItem('refresh_token', tokenResult.refresh_token);
      return true;
    } else {
      return false;
    }
  }
};
*/

import state from '../states/auth.js';
import actions from '../actions/auth.js';
import mutations from '../mutations/auth.js';

export default {
  state,
  actions,
  mutations
};
