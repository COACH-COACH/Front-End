import { createStore } from 'vuex';

export default createStore({
  state: {
    isAuthenticated: false,
    token: null,
    isLoading: false
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      state.isAuthenticated = true; // 로그인 상태를 true로 설정
    },
    clearToken(state) {
      state.token = null;
      state.isAuthenticated = false; // 로그아웃 상태로 설정
    },
    setLoading(state, status) {
      state.isLoading = status;
    }
  },
  actions: {
    login({ commit }, { token }) {
      commit('setToken', token);
      sessionStorage.setItem('token', token); // 세션 스토리지에 토큰 저장
    },
    logout({ commit }) {
      commit('clearToken');
      sessionStorage.removeItem('token'); // 세션 스토리지에서 토큰 제거
    },
    restoreToken({ commit }) {
      const token = sessionStorage.getItem('token');
      if (token) {
        commit('setToken', token);
      }
    },
    startLoading({ commit }) {
      commit('setLoading', true);
    },
    stopLoading({ commit }) {
      commit('setLoading', false);
    }
  },
  getters: {
    isLoggedIn: state => state.isAuthenticated,
    getToken: state => state.token,
    isLoading: state => state.isLoading
  }
});
