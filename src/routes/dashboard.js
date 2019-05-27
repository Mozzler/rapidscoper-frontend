import Home from '@/components/pages/dashboard/Home';
import PastInvoice from '@/components/pages/dashboard/PastInvoice';

export default [
  {
    path: '/:section/:name',
    name: 'dashboard',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/:section/:name/past-invoice',
    name: 'past-invoice',
    component: PastInvoice,
    meta: {
      requiresAuth: true
    }
  }
]
