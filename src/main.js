import Vue from 'vue';

import './plugins';

import store from './store';
import router from './routes';

import App from './App.vue';

import ConverterMixin from '@/mixins/converter';

Vue.config.productionTip = false;

Vue.mixin(ConverterMixin);

let main = new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
});

export default main;
