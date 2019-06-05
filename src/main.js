import Vue from 'vue';

import './plugins';

import store from './store';
import router from './routes';

import App from './App.vue';

Vue.config.productionTip = false;

let main = new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
});

export default main;
