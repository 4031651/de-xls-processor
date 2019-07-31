import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';
import Toasted from 'vue-toasted';

import configureApi from './api';
import config from './constants/config';
import App from './App.vue';

configureApi(config.baseURL);

Vue.use(Vuetify);
Vue.use(Toasted);

Vue.config.productionTip = false;

new Vue({
  vuetify: new Vuetify({
    icons: {
      iconfont: 'mdi',
    },
  }),
  render: h => h(App),
}).$mount('#app');
