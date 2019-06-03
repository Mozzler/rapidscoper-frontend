import AuthLanding from '@/components/pages/auth/AuthLanding';
import AuthFlow from '@/components/pages/auth/AuthFlow';

export default [
  {
    path: '/login',
    name: 'login',
    component: AuthLanding,
    meta: {
      guest: true
    }
  },
  {
    path: '/signup',
    name: 'signup',
    component: AuthLanding,
    meta: {
      guest: true
    }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: AuthFlow,
    meta: {
      guest: true
    }
  },
  {
    path: '/change-password',
    name: 'change-password',
    component: AuthFlow,
    meta: {
      guest: true
    }
  },
  {
    path: '/create-account',
    name: 'create-account',
    component: AuthFlow,
    meta: {
      guest: true
    }
  },
  {
    path: '/accept-invite',
    name: 'accept-invite',
    component: AuthFlow,
  },
  {
    path: '/create-team',
    name: 'create-team',
    component: AuthFlow,
    meta: {
      guest: true
    }
  },
];
