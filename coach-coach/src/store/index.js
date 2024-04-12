import { createStore } from 'vuex';

export default createStore({
  state: {
    isAuthenticated: false,
    token: null
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      state.isAuthenticated = true; // 로그인 상태를 true로 설정
    },
    clearToken(state) {
      state.token = null;
      state.isAuthenticated = false; // 로그아웃 상태로 설정
    }
  },
  actions: {
    login({ commit }, { token }) {
      commit('setToken', token);
      sessionStorage.setItem('token', token); // 로컬 스토리지에 토큰 저장
    },
    logout({ commit }) {
      commit('clearToken');
      sessionStorage.removeItem('token'); // 로컬 스토리지에서 토큰 제거
    },
    restoreToken({ commit }) {
      const token = sessionStorage.getItem('token');
      if (token) {
        commit('setToken', token);
      }
    }
  },
  getters: {
    isLoggedIn: state => state.isAuthenticated,
    getToken: state => state.token
  }
});
