import { 
  IS_AUTHENTICATED,
  CHANGE_AUTHENTICATED,
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_REGISTER
} from '../actions/auth';

const state = {
  is_authenticated: !!localStorage.getItem('token'),
};

const getters = {
  [IS_AUTHENTICATED]: () => !!state.is_authenticated
};

const mutations = {
  [CHANGE_AUTHENTICATED]: (state, data) => state.is_authenticated = data
};

const actions = {
  [AUTH_LOGIN]: async ({ commit }, data) => {
    // commit(CHANGE_AUTHENTICATED, true);
    // localStorage.setItem('token', 'superSecretToken');
  },
  [AUTH_LOGOUT]: ({ commit }) => {
    // commit(CHANGE_AUTHENTICATED, false);
    // localStorage.removeItem('token');
  },
  [AUTH_REGISTER]: ({ commit }, data) => {
    commit(CHANGE_AUTHENTICATED, true);
    localStorage.setItem('token', 'superSecretToken');
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
