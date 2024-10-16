import { createApp } from 'vue';
import {createPinia } from 'pinia'
import App from './App.vue';
import vuetify from './plugins/vuetify'; // If you're using Vuetify
import './assets/main.css'; // If you're using Tailwind CSS
import router from './router';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

createApp(App).use(pinia).use(vuetify).use(router).mount('#app');
