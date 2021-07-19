import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import router from './router/index'
import store from './store/index'
const app=createApp(App)
app.config.globalProperties.$router=router
app.config.globalProperties.$wsurl='ws://192.168.1.102:8000'
app.use(router).use(store).mount('#app')
