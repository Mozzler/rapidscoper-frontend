import Vue from 'vue';
import Router from 'vue-router';
import SignupRoutes from './signup';
import helpers from './router-helpers';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/',
      name: 'main',
      component: () => import('@/components/pages/Home'),
      beforeEnter: helpers.ifAuthenticated
      // children: [],
    },
    ...SignupRoutes
  ]
});

export default router;
