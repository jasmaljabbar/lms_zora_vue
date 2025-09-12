import './assets/input.css'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const app = createApp(App)

app.use(ElementPlus)

app.use(router)

app.use(Vue3Toastify, {
  autoClose: 2000,
})

app.mount('#app')
