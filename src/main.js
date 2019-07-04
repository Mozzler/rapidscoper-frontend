import * as _ from 'underscore';
import * as moment from 'moment';
import v4 from 'uuid';

import Vue from 'vue';
import VueTelInput from 'vue-tel-input';
import Alert from '@/components/particles/alerts/alert';

import './plugins';

import store from './store';
import router from './routes';

import App from './App.vue';

import ConverterMixin from '@/mixins/converter';

Vue.component('vue-tel-input', VueTelInput);
Vue.component('alert', Alert);

Vue.config.productionTip = false;
window._ = _;
window.moment = moment;

Vue.mixin(ConverterMixin);
Vue.prototype.uuid = v4;

let main = new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
});

export default main;
