import Vue from 'vue';
import GAuth from 'vue-google-oauth2';

const gauthOption = {
  clientId: '995262028269-vbu13g8ceqt31i5cfdgnfti1de618hav.apps.googleusercontent.com',
  scope: 'profile email',
  prompt: 'select_account'
};

Vue.use(GAuth, gauthOption);
