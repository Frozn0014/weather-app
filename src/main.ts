import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import Tooltip from '@adamdehaven/vue-custom-tooltip';
import './index.css';
import App from './App.vue';
import NotFound from './404.vue';
import Weather from './Weather.vue';
import Register from './Register.vue';

const routes = [
  { path: '/', redirect: '/weather/realtime' },
  { path: '/weather', redirect: '/weather/realtime' },
  { path: '/weather/:mode', component: Weather },
  { path: '/register', component: Register },
  { path: '/:pathMatch(.*)*', component: NotFound }
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes
});

const pinia = createPinia();

const app = createApp(App);

app.use(router);
app.use(pinia);

app.use(Tooltip, {
  name: 'VueCustomTooltip',
  background: '#1e293b',
  fontWeight: 500
});

app.mount('#app');
