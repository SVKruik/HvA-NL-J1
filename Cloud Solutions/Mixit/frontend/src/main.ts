import './assets/base.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia'
import App from './App.vue';
import router from './router';
import VueCookies from 'vue-cookies';

createApp(App)
    .use(createPinia())
    .use(router)
    .use(VueCookies)
    .mount('#app');
