import Vue from 'vue';
import Router from 'vue-router';
import SignupRoutes from './signup';
import helpers from './router-helpers';

Vue.use(Router);

import Home from '@/components/pages/Home';

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/dashboard/all-projects'
    },
    {
      path: '/dashboard/:tab',
      name: 'main',
      component: Home,
      beforeEnter: helpers.ifAuthenticated
    },
    ...SignupRoutes
  ]
});

export default router;
