import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

async function setCSRFToken() {
  await fetch('https://conduit.dedyn.io/api/set-csrf-token/', {
    method: 'GET',
    credentials: 'include'
  })
}
setCSRFToken()
app.mount('#app')
