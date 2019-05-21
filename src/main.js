import Vue from 'vue';
import App from './App.vue';

import store from './store';
import router from './routes';

import './plugins/vuetify';
import './plugins/axios';

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
});
