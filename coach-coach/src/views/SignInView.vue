<template>
  <div>
    <div v-if="isLoading" class="loading-overlay">
      <img src="@/assets/loading.gif" alt="Loading..." />
    </div>
    <h1>로그인</h1>
    <form @submit.prevent="login" class="login-form">
      <div class="form-group">
        <label for="loginId">아이디:</label>
        <input type="text" id="loginId" v-model="loginId" class="form-input">
      </div>
      <div class="form-group">
        <label for="loginPw">비밀번호:</label>
        <input type="password" id="loginPw" v-model="loginPw" class="form-input">
      </div>
      <button type="submit" class="btn-submit">로그인</button>
    </form>
    <div v-if="isLoggedIn" class="login-success">
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
    ...mapGetters(['isLoggedIn', 'getToken', 'isLoading'])
  },
  methods: {
    async login() {
      const url = process.env.VUE_APP_API_URL + '/login';

      const formData = new FormData();
      formData.append('loginId', this.loginId);
      formData.append('loginPw', this.loginPw);

      try {
        const response = await axios.post(url, formData);
        const token = response.headers.get("Authorization"); // 헤더에서 JWT 토큰 가져오기

        console.log(token);
        this.$store.dispatch('login', { token }); // Vuex store에 토큰 저장, login 액션 실행
        this.$router.push('/main/goal');
      } catch (error) {
        this.$store.dispatch('stopLoading');
        alert('아이디 혹은 비밀번호를 확인해 주세요.')
      }
    }
  }
};
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5); /* 배경을 약간 어둡게 처리 */
}

.loading-overlay img {
  width: 120px; /* GIF 이미지 크기 조절 */
  height: auto;
}

.login-form {
  max-width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-group {
  margin-bottom: 15px;
}

.form-input {
  width: 93%;
  padding: 8px;
  font-size: 1rem;
}

.btn-submit {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.login-success {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #28a745;
  border-radius: 5px;
  background-color: #d4edda;
  color: #155724;
}

.login-success h2 {
  margin-bottom: 10px;
}

.centered-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 화면 전체 높이를 기준으로 중앙 정렬 */
}

h1 {
  text-align: center;
}
</style>