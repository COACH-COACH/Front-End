
<template>
  <div>
    <h1>로그인</h1>
    <form @submit.prevent="login">
      <div>
        <label for="loginId">아이디:</label>
        <input type="text" id="loginId" v-model="loginId">
      </div>
      <div>
        <label for="loginPw">비밀번호:</label>
        <input type="password" id="loginPw" v-model="loginPw">
      </div>
      <button type="submit">로그인</button>
    </form>
    <div v-if="isLoggedIn">
      <h2>로그인 성공!</h2>
      <p>발급된 토큰: {{ getToken }}</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
  data() {
    return {
      loginId: '',
      loginPw: ''
    };
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'getToken'])
  },
  methods: {
    async login() {
      const url = 'http://localhost:8080/login';

      const formData = new FormData();
      formData.append('loginId', this.loginId);
      formData.append('loginPw', this.loginPw);

      try {
        const response = await axios.post(url, formData);

        const token = response.headers.authorization; // 헤더에서 JWT 토큰 가져오기
        this.$store.dispatch('login', { token }); // Vuex store에 토큰 저장, login 액션 실행

        // 토큰 저장 등의 추가 작업 수행 가능
      } catch (error) {
        console.error('로그인 실패:', error);
      }
    }
  }
};
</script>
