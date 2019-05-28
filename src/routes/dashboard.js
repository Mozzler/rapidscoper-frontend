import Home from '@/components/pages/dashboard/Home';

export default [
  {
    path: '/:section/:name',
    name: 'dashboard',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
]
