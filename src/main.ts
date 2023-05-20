import { createApp } from 'vue';
import Tooltip from '@adamdehaven/vue-custom-tooltip'
import './index.css';
import App from './App.vue';

const app = createApp(App);

app.use(Tooltip, {
  name: 'VueCustomTooltip',
  background: '#1e293b',
  fontWeight: 500
})

app.mount('#app');
