import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

const token = sessionStorage.getItem('token');

if (token) {
    // 세션 스토리지에 토큰이 있으면 Vuex 스토어에 저장
    store.commit('setToken', token);
}
createApp(App).use(store).use(router).mount('#app');