import axios from 'axios';
import { API_URL } from '../../config';
import store from '@/store';
import app from '@/main';

let VueAxiosPlugin = {};

VueAxiosPlugin.install = (Vue, options) => {
  axios.defaults.baseURL = API_URL;

  const defaultOptions = {
    reqHandleFunc: config => {
      const user = store.state.auth.user;
      if (user !== null) {
        config.headers.authorization = `${ user.token_type } ${ user.access_token }`;
      }
      config.headers['Content-Type'] = 'application/json';
      return config;
    },
    reqErrorFunc: error => Promise.reject(error),
    resHandleFunc: response => response,
    resErrorFunc: error => {
      if (error.response.status === 401) {
        store.dispatch('auth/logout')
          .then(() => app.$socket.disconnect())
          .then(() => {
            app.$router.push('/login');
          });
      } else {
        return Promise.reject(error);
      }
    }
  };

  const initOptions = {
    ...defaultOptions,
    ...options
  };

  const service = axios.create(initOptions);

  service.interceptors.request.use(
    (config) => initOptions.reqHandleFunc(config),
    error => initOptions.reqErrorFunc(error)
  );

  service.interceptors.response.use(
    response => initOptions.resHandleFunc(response),
    error => initOptions.resErrorFunc(error)
  );

  Vue.$axios = service;

  Object.defineProperties(Vue.prototype, {
    $axios: {
      get () {
        return service;
      }
    }
  });
};

export default VueAxiosPlugin;
