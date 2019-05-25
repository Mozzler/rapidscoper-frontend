import Vue from 'vue';
import Router from 'vue-router';
import SignupRoutes from './signup';
import helpers from './router-helpers';

import Home from '@/components/pages/dashboard/Home';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/dashboard/all-projects'
    },
    {
      path: '/:section/:name',
      name: 'dashboard',
      component: Home,
      beforeEnter: helpers.ifAuthenticated
    },
    ...SignupRoutes
  ]
});

export default router;
