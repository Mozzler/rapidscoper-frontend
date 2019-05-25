import helpers from './router-helpers';

import AuthLanding from '@/components/pages/auth/AuthLanding';
import AuthFlow from '@/components/pages/auth/AuthFlow';

export default [
  {
    path: '/login',
    name: 'login',
    beforeEnter: helpers.ifNotAuthenticated,
    component: AuthLanding
  },
  {
    path: '/signup',
    name: 'signup',
    beforeEnter: helpers.ifNotAuthenticated,
    component: AuthLanding
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    beforeEnter: helpers.ifNotAuthenticated,
    component: AuthFlow
  },
  {
    path: '/change-password',
    name: 'change-password',
    beforeEnter: helpers.ifNotAuthenticated,
    component: AuthFlow
  },
  {
    path: '/create-account',
    name: 'create-account',
    beforeEnter: helpers.ifAuthenticated,
    component: AuthFlow
  },
  {
    path: '/accept-invite',
    name: 'accept-invite',
    component: AuthFlow
  }
];
