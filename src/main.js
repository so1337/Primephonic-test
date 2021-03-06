import Vue from 'vue';
import 'vuetify/dist/vuetify.min.css'; // Ensure you are using css-loader
import Vuetify from 'vuetify';
import App from './App.vue';


Vue.config.productionTip = false;

Vue.use(Vuetify);
new Vue({
  render: h => h(App),
}).$mount('#app');
