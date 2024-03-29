import Vue from 'vue';
import Vuetify from 'vuetify';

import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
    primary: '#7839DF',
    secondary: '#fff'
  }
});
