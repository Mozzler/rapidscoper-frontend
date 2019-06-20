import axios from 'axios';
import { API_URL } from '../../config';
import store from '@/store';

let VueAxiosPlugin = {};

VueAxiosPlugin.install = (Vue, options) => {
  axios.defaults.baseURL = API_URL;

  const defaultOptions = {
    reqHandleFunc: config => config,
    reqErrorFunc: error => Promise.reject(error),
    resHandleFunc: response => response,
    resErrorFunc: error => Promise.reject(error)
  };

  const initOptions = {
    ...defaultOptions,
    ...options
  };

  const headers = {
    'Content-Type': 'application/json'
  };

  const user = store.state.auth.user ? store.state.auth.user : null;
  if (user) {
    headers['Authorization'] = `${ user.token_type } ${ user.access_token }`;
  }

  axios.defaults.headers.common = headers;

  const service = axios.create(initOptions);

  service.interceptors.request.use(
    config => initOptions.reqHandleFunc(config),
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
