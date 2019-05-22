import helpers from './router-helpers';

export default [
  {
    path: '/login',
    name: 'login',
    beforeEnter: helpers.ifNotAuthenticated,
    component: () => import('@/components/pages/Auth')
  },
  {
    path: '/signup',
    name: 'signup',
    beforeEnter: helpers.ifNotAuthenticated,
    component: () => import('@/components/pages/Auth')
  }
  // {
  //   path: '/signup/google',
  //   name: 'signup-google'
  // },
  // {
  //   path: '/signup/github',
  //   name: 'signup-github'
  // },
  // {
  //   path: '/signup/forgot-password',
  //   name: 'forgot-password'
  // },
  // {
  //   path: '/signup/forgot-password-success',
  //   name: 'forgot-password-success'
  // },
  // {
  //   path: '/signup/change-password',
  //   name: 'change-password'
  // }
];
