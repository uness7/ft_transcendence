import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import './assets/styles/global.css'
import axios from 'axios'
import { useAuthStore } from './store/auth'

const app = createApp(App)
const pinia = createPinia();

app.use(pinia)
app.use(router)
app.use(i18n)

const authStore = useAuthStore()

// Axios interceptor for token refresh
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === 401) {
      const originalRequest = error.config
      if (!originalRequest._retry) {
        originalRequest._retry = true
        const newToken = await authStore.refreshToken()
        if (newToken) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`
          return axios(originalRequest)
        }
      }
    }
    return Promise.reject(error)
  }
)

app.mount('#app')
