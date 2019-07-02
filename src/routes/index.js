import Vue from 'vue';
import Router from 'vue-router';

import SignupRoutes from './signup';
import DashboardRoutes from './dashboard';

import store from '../store';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/dashboard/all-projects'
    },
    ...DashboardRoutes,
    ...SignupRoutes,
  ]
});

router.beforeEach((to, from, next) => {

  const user = store.state.auth.user;
  const authenticated = user !== null;

  /*if (authenticated && user.firstName && to.name === 'create-account') {
    next('/');
  } else if (authenticated && !user.firstName && to.name !== 'create-account') {
    next('/create-account');
  } else*/ if (to.meta.guest && authenticated) {
    next('/');
  } else if (to.meta.requiresAuth && !authenticated) {
    next('/signup');
  } else {
    next();
  }
});

export default router;
