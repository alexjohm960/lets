import { createApp as createClientApp, createSSRApp } from 'vue'
import { createHead } from '@unhead/vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

export function createApp() {
  const app = import.meta.env.SSR
    ? createSSRApp(App)
    : createClientApp(App);
  
  const head = createHead();

  app.use(router);
  app.use(head);

  return { app, router, head };
}

if (!import.meta.env.SSR) {
  const { app, router } = createApp();
  router.isReady().then(() => {
    app.mount('#app');
  });
}