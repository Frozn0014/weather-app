import { createApp } from 'vue';
import Tooltip from '@adamdehaven/vue-custom-tooltip'
import './index.css';
import App from './App.vue';

const app = createApp(App);

app.use(Tooltip)

app.mount('#app');
