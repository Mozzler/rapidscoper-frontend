import Vue from 'vue';
import Router from 'vue-router';

import list from './list.js';

Vue.use(Router);

let router = new Router({
  routes: list,
  mode: 'history'
});

export default router;
