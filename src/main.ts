import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import Tooltip from '@adamdehaven/vue-custom-tooltip';
import './index.css';
import App from './App.vue';
import RealtimeVue from './Realtime.vue';
import ForecastVue from './Forecast.vue'

const routes = [
  { path: '/', redirect: '/realtime'},
  { path: '/realtime', component: RealtimeVue },
  { path: '/forecast', component: ForecastVue}
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes
});

const app = createApp(App);

app.use(router);

app.use(Tooltip, {
  name: 'VueCustomTooltip',
  background: '#1e293b',
  fontWeight: 500
});

app.mount('#app');
