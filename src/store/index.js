import Vue from 'vue';
import Vuex from 'vuex';

import auth from './modules/auth';
import system from './mutations/system';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true, // remove for production
  modules: {
    auth
  },
  mutations: system
});
