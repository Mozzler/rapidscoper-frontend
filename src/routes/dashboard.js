import Home from '@/components/pages/dashboard/Home';
import UserStories from '@/components/pages/user-stories/UserStories';

export default [
  {
    path: '/projects/:name',
    name: 'projects',
    component: UserStories,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/:section/:name',
    name: 'dashboard',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
];
