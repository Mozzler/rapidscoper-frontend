import Vue from 'vue';
import Router from 'vue-router';

import SignupRoutes from './signup';
import DashboardRoutes from './dashboard';

import store from '../store';
import { IS_AUTHENTICATED } from '../store/actions/auth';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/dashboard/all-projects'
    },
    ...DashboardRoutes,
    ...SignupRoutes,
  ]
});

router.beforeEach((to, from, next) => {

  let authenticated = store.getters[IS_AUTHENTICATED];

  if (to.meta.guest && authenticated) {
    next('/dashboard');
  }
  else if (to.meta.requiresAuth && !authenticated) {
    next('/signup');
  }
  else {
    next();
  }
});

export default router;
