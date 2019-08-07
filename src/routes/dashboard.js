import Home from '@/components/pages/dashboard/Home';
import UserStories from '@/components/pages/user-stories/UserStories';
import Dictionary from '@/components/pages/user-stories/Dictionary';
import SharedProject from '@/components/pages/dashboard/SharedProject';

export default [
  {
    path: '/projects/:projectId/:storyType/:section/:tab',
    name: 'stories',
    component: UserStories,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/dictionary/:projectId/:section',
    name: 'dictionary',
    component: Dictionary,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/project/:projectName/:projectShareId/:token',
    name: 'shared-project',
    component: SharedProject,
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
  }
];
