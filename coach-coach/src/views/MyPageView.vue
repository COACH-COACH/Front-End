<template>
  <div class="container">
    <!-- 왼쪽 사이드 바 -->
    <div class="sidebar">
      <!-- 버튼 -->
      <button @click="showPage('page1')">내 정보 수정</button>
      <button @click="showPage('page2')">가입 상품 조회</button>
      <button @click="showPage('page3')">과거 목표 조회</button>
    </div>

    <!-- 오른쪽 내용 영역 -->
    <div class="content">
      <!-- 페이지 내용을 동적으로 표시 -->
      <div v-if="currentPage === 'page1'">
        <h1>내 정보 수정</h1>
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
        <h1>목표와 가입 상품 조회</h1>
        <h2>{{ userData.fullName }} 님의 목표와 가입 상품</h2>
        <div v-if="userData.goals && userData.goals.length > 0">
          <div v-for="goal in userData.goals" :key="goal.goalId" class="goal-container">
            <h3>{{ goal.goalName }}</h3>
            <p>목표 금액: {{ goal.targetCost }}</p>
            <p>시작일: {{ formatDate(goal.startDate) }}</p>
            <p>목표 기간: {{ goal.goalPeriod }} 개월</p>
            <p>누적 금액: {{ goal.accumulatedBalance }}</p>
            <p>상품명: {{ goal.productName }}</p>
          </div>
        </div>
        <p v-else>등록된 목표가 없습니다.</p>
        
      </div>
      <div v-else-if="currentPage === 'page3'">
        <h1>과거 목표 조회</h1>
        <div v-if="filteredGoals.length > 0">
          <h2>목표 - 금액(원) - 시작일자 - 종료일자</h2>
          <ul>
            <li v-for="goal in filteredGoals" :key="goal.id">
              <strong>{{ goal.goalName }}</strong> - {{ goal.targetCost | currencyFormat }} - {{ formatDate(goal.startDate) }} - {{ formatDate(goal.endDate) }}
            </li>
          </ul>
        </div>
        <div v-else>
          <p>완료된 목표가 없습니다.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['getToken']), // Vuex의 getToken getter를 컴포넌트 내에서 사용 가능하게 등록
    filteredGoals() {
      // goals 배열에서 goalSt 값이 0인 데이터만 필터링하여 반환
      return this.goals.filter(goal => goal.goalSt === 1);
    }
  },
  filters: {
    currencyFormat(value) {
      // 숫자를 통화 형식(달러)으로 변환하는 필터
      return `$${value.toFixed(2)}`;
    }
  },
  data() {
    return {
      goals: [], // API로부터 받아온 목표 데이터
      formData: {
        loginPw: null,
        lifeStage: null // 기본 선택 값은 빈 문자열로 설정
      },
      responseMessage: null,
      responseMessageDeactivate: null,
      currentPage: 'page1', // 초기 페이지 설정
      userData: {
        userId: null,
        fullName: "",
        goals: []
      }
    };
  },
  mounted() {
    this.fetchGoals();
    this.fetchGoalData();
  },
  methods: {
    // 페이지를 변경하는 메서드
    showPage(pageName) {
      this.currentPage = pageName;
    },

    async fetchGoals() {
      const url = 'http://localhost:8080/goal/list'
      try {
        const token = this.getToken;

        const response = await axios.get(url, {
          headers: {
            Authorization: `${token}`, // HTTP 요청 헤더에 토큰 포함
          }
        });

        this.goals = response.data.data; // API로부터 받은 데이터를 goals에 저장
      } catch (error) {
        console.error('목표 조회 실패:', error);
      }
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
    },

    async fetchGoalData() {
      const url = 'http://localhost:8080/goal/product/list';

      try {
        const token = this.getToken;
        console.log(token);

        const response = await axios.get(url, {
          headers: {
            Authorization: `${token}`, // HTTP 요청 헤더에 토큰 포함
          }
        });
        // const data = await response.json();
        this.userData = response.data.data;
        console.log(userData);

      } catch (error) {
        console.error('사용자 목표 조회 중 오류 발생:', error);
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR');
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
