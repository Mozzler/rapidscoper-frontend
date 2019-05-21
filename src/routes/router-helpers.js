import store from '../store';
import { IS_AUTHENTICATED } from '../store/actions/auth';

export default {
  ifNotAuthenticated (to, from, next) {
    if (!store.getters[IS_AUTHENTICATED]) {
      next();
      return;
    }
    next('/');
  },
  ifAuthenticated (to, from, next) {
    if (store.getters[IS_AUTHENTICATED]) {
      return next();
    }
    next('/signup');
  }
};
