<template>
  <div>
    <h1>회원가입</h1>
    <form @submit.prevent="submitForm">
      <div>
        <label for="loginId">아이디:</label>
        <input type="text" id="loginId" v-model="postData.loginId">
      </div>
      <div>
        <label for="loginPw">비밀번호:</label>
        <input type="password" id="loginPw" v-model="postData.loginPw">
      </div>
      <div>
        <label for="fullName">이름:</label>
        <input type="text" id="fullName" v-model="postData.fullName">
      </div>
      <div>
        <label for="sex">성별:</label>
        <select id="sex" v-model="postData.sex">
          <option value="M">남성</option>
          <option value="F">여성</option>
        </select>
      </div>
      <div>
        <label for="birthDate">생년월일:</label>
        <input type="text" id="birthDate" v-model="postData.birthDate">
      </div>
      <div>
        <label for="region">지역:</label>
        <input type="text" id="region" v-model="postData.region">
      </div>
      <div>
        <label for="lifeStage">생애 주기:</label>
        <input type="text" id="lifeStage" v-model="postData.lifeStage">
      </div>
      <button type="submit">가입</button>
    </form>
    <div v-if="response">
      <h2>가입 결과:</h2>
      <p>아이디: {{ response.loginId }}</p>
      <p>이름: {{ response.fullName }}</p>
      <p>생애 주기: {{ response.lifeStage }}</p>
      <!-- 원하는 결과 데이터 표시 -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      postData: {
        loginId: '',
        loginPw: '',
        fullName: '',
        sex: 'M',
        birthDate: '',
        region: '',
        lifeStage: ''
      },
      response: null
    };
  },
  methods: {
    async submitForm() {
      const url = 'http://localhost:8080/user/join';

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
          body: JSON.stringify(this.postData)
        });

        const responseData = await response.json();
        this.response = responseData;
      } catch (error) {
        console.error('가입 요청 중 오류 발생:', error);
      }
    }
  }
};
</script>
