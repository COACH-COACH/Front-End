<template>
  <div class="container">
    <!-- 왼쪽 사이드 바 -->
    <div class="sidebar">
      <!-- 상단 버튼 -->
      <button @click="showPage('page1')">내 정보 조회</button>
      <!-- 하단 버튼 -->
      <button @click="showPage('page2')">가입 상품 조회</button>
    </div>

    <!-- 오른쪽 내용 영역 -->
    <div class="content">
      <!-- 페이지 내용을 동적으로 표시 -->
      <div v-if="currentPage === 'page1'">
        <h1>내 정보 조회</h1>
        <h2>Modify Member Information</h2>
        <form @submit.prevent="submitForm">
          <label for="loginPw">New Password :</label>
          <input type="password" id="loginPw" v-model="formData.loginPw">
          <br>

          <label for="lifeStage">New Life Stage :</label>
          <select id="lifeStage" v-model="formData.lifeStage">
            <option value="UNI">대학생</option>
            <option value="NEW_JOB">사회 초년생</option>
            <option value="NEW_WED">신혼 부부</option>
            <option value="HAVE_CHILD">자녀 있음</option>
            <option value="NO_CHILD">자녀 없음</option>
            <option value="RETIR">은퇴</option>
          </select>
          <br>

          <button type="submit">Update Information</button>
        </form>
        <div v-if="responseMessage">
          <p>{{ responseMessage }}</p>
        </div>
        <h2>회원 비활성화</h2>
        <button @click="deactivateUser">사용자 비활성화</button>
        <div v-if="responseMessageDeactivate">
          <p>{{ responseMessageDeactivate }}</p>
        </div>
      </div>
      <div v-else-if="currentPage === 'page2'">
        <h2>Page 2 Content</h2>
        <!-- Page 2의 내용 -->
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['getToken']) // Vuex의 getToken getter를 컴포넌트 내에서 사용 가능하게 등록
  },
  data() {
    return {
      formData: {
        loginPw: '',
        lifeStage: '' // 기본 선택 값은 빈 문자열로 설정
      },
      responseMessage: null,
      responseMessageDeactivate: null,
      currentPage: 'page1' // 초기 페이지 설정
    };
  },
  methods: {
    // 페이지를 변경하는 메서드
    showPage(pageName) {
      this.currentPage = pageName;
    },

    async submitForm() {
      const url = 'http://localhost:8080/user/modify';

      try {
        const token = this.getToken;
        console.log(token); // 여기까진 잘 됨

        const response = await axios.put(url, this.formData, {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            Authorization: token, // Authorization 헤더에 토큰 직접 설정
          }
        });

        // 서버로부터 응답 받은 메시지 표시
        this.responseMessage = await response.data;
      } catch (error) {
        console.error('Failed to update information:', error);
        this.responseMessage = 'Failed to update information';
      }
    },
    
    async deactivateUser() {
      const url = 'http://localhost:8080/user/deactivate';

      try {
        const token = this.getToken;

        const response = await axios.get(url, {
          headers: {
            Authorization: `${token}`, // HTTP 요청 헤더에 토큰 포함
          }
        });
        // 서버로부터 받은 응답 메시지 표시
        this.responseMessageDeactivate = response.data.message; // 응답 데이터에서 필요한 정보를 추출하여 표시
      } catch (error) {
        console.error('사용자 비활성화 요청 실패:', error);
        this.responseMessageDeactivate = '사용자 비활성화 요청에 실패하였습니다.';
      }
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
}

.sidebar {
  width: 150px; /* 사이드 바의 너비 설정 */
  padding: 20px;
  border-right: 1px solid #ccc; /* 사이드 바 우측 테두리 추가 */
}

.sidebar button {
  display: block;
  margin-bottom: 10px;
}

.content {
  padding: 20px;
  flex: 1; /* 오른쪽 컨텐츠 영역이 남은 공간을 모두 차지하도록 설정 */
}
</style>
