import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';

import modules from './modules';

Vue.use(Vuex);

const vuexLocalStorage = new VuexPersist({
  key: 'RapidScoper-service-vuex',
  storage: localStorage,
  reducer: (state) => ({
    entity: {
      team: state.entity.team,
      project: state.entity.project
    },
    auth: {
      user: state.auth.user
    }
  })
});

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: modules,
  plugins: [vuexLocalStorage.plugin]
});
