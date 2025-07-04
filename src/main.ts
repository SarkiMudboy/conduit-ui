import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

//async function setCSRFToken() {
//  const baseURL = import.meta.env.VITE_CONDUIT_BASE_URL
//
//  await fetch(`${baseURL}set-csrf-token/`, {
//    method: 'GET',
//    credentials: 'include'
//  })
//  .then(response=>response.json())
//  .then(data=> {
//
//  })
//}
//setCSRFToken()
app.mount('#app')
