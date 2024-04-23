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
        <datepicker
          id="birthDate"
          v-model="postData.birthDate"
          :format="datePickerFormat"
          :input-class="'form-control'"
          placeholder="날짜 선택"
          @input="handleDateInput"
        ></datepicker>
      </div>
      <div>
        <label for="region">지역:</label>
        <input type="text" id="region" v-model="postData.region">
      </div>
      <div>
        <label for="lifeStage">생애 주기:</label>
        <select id="lifeStage" v-model="postData.lifeStage">
          <option value="UNI">대학생</option>
          <option value="NEW_JOB">사회 초년생</option>
          <option value="NEW_WED">신혼 부부</option>
          <option value="HAVE_CHILD">자녀 있음</option>
          <option value="NO_CHILD">자녀 없음</option>
          <option value="RETIR">은퇴</option>
        </select>
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
import Datepicker from 'vue3-datepicker';

export default {
  components: {
    Datepicker
  },
  data() {
    return {
      postData: {
        loginId: '',
        loginPw: '',
        fullName: '',
        sex: 'M',
        birthDate: null,
        region: '',
        lifeStage: 'UNI'
      },
      response: null,
      datePickerFormat: 'yyyy-MM-dd' // 달력의 표시 형식
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
    },
    handleDateInput(date) {
      // 날짜가 선택되면 해당 날짜를 ISO 형식(yyyy-MM-dd)으로 포맷하여 postData에 할당
      this.postData.birthDate = date ? date.toISOString().split('T')[0] : null;
    }
  }
};
</script>

<style>
/* 선택된 날짜 피커 스타일링 (선택사항) */
.form-control {
  width: 200px;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}
</style>
