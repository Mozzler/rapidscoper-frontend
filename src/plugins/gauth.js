import Vue from 'vue';
import GAuth from 'vue-google-oauth2';

const gauthOption = {
  clientId: '819009389205-hj30egdsu5lcpgm7859mrncjtqil7drn.apps.googleusercontent.com',
  scope: 'profile email',
  prompt: 'select_account'
};

Vue.use(GAuth, gauthOption);
