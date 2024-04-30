import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// fontawesome import
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(fas)


// 이 파일이 진입점. 새로고침하면 여기서 초기화 작업 수행됨

const token = sessionStorage.getItem('token');

if (token) {
    // 세션 스토리지에 토큰이 있으면 Vuex 스토어에 저장
    store.commit('setToken', token);
}

createApp(App).component('font-awesome-icon', FontAwesomeIcon).use(store).use(router).mount('#app')
