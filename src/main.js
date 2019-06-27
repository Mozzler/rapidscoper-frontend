import * as _ from 'underscore';

import Vue from 'vue';
import VueTelInput from 'vue-tel-input';

import './plugins';

import store from './store';
import router from './routes';

import App from './App.vue';

import ConverterMixin from '@/mixins/converter';

Vue.component('vue-tel-input', VueTelInput);

Vue.config.productionTip = false;
window._ = _;

Vue.mixin(ConverterMixin);

let main = new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
});

export default main;
