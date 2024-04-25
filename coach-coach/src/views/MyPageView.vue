<template>
  <div class="container">
    <!-- 왼쪽 사이드 바 -->
    <div class="sidebar">
      <!-- 버튼 -->
      <button class="sidebar-button" @click="showPage('page1')">내 정보 수정</button>
      <button class="sidebar-button" @click="showPage('page2')">가입 상품 조회</button>
      <button class="sidebar-button" @click="showPage('page3')">과거 목표 조회</button>
    </div>

    <!-- 오른쪽 내용 영역 -->
    <div class="content">
      <!-- 페이지 내용을 동적으로 표시 -->
      <div v-if="currentPage === 'page1'" class="page-content">
        <h1>내 정보 수정</h1>
        <h2>회원 정보 수정하기</h2>
        <form @submit.prevent="submitForm" class="form">
          <div class="form-group">
            <label for="loginPw">새로운 비밀번호 :</label>
            <input type="password" id="loginPw" v-model="formData.loginPw" class="form-input">
          </div>
          <div class="form-group">
            <label for="loginPw">비밀번호 확인 :</label>
            <input type="password" id="pwConfirm" v-model="pwConfirm" class="form-input">
          </div>
          <div class="form-group">
            <label for="lifeStage">새로운 생애주기 :</label>
            <select id="lifeStage" v-model="formData.lifeStage" class="form-select">
              <option value="UNI">대학생</option>
              <option value="NEW_JOB">사회 초년생</option>
              <option value="NEW_WED">신혼 부부</option>
              <option value="HAVE_CHILD">자녀 있음</option>
              <option value="NO_CHILD">자녀 없음</option>
              <option value="RETIR">은퇴</option>
            </select>
          </div>
          <button type="submit" class="btn">정보 업데이트</button>
        </form>
        <!-- 정보 업데이트가 어떻게 됐는지 보고 싶으면 아래 주석 해제 -->
        <!-- <div v-if="responseMessage" class="response-message">
          <p>{{ responseMessage }}</p>
        </div> -->
        <br>
        <h2>회원 비활성화</h2>

        <!-- 사용자 비활성화 버튼 -->
        <button @click="confirmDeactivateUser" class="btn">사용자 비활성화</button>

        <!-- 확인 대화상자 모달 -->
        <div v-if="showConfirmModal" class="confirm-modal">
          <div class="confirm-content">
            <p>사용자를 비활성화 하시겠습니까?</p>
            <div class="btn-group">
              <button @click="deactivateUser" class="btn">확인</button>
              <button @click="cancelDeactivate" class="btn">취소</button>
            </div>
          </div>
        </div>

        <!-- <button @click="deactivateUser" class="btn">사용자 비활성화</button> -->
        <div v-if="responseMessageDeactivate" class="response-message">
          <p>{{ responseMessageDeactivate }}</p>
        </div>
      </div>

      <div v-else-if="currentPage === 'page2'" class="page-content">
        <h1>목표와 가입 상품 조회</h1>
        <h2>{{ userData.fullName }} 님의 목표와 가입 상품</h2>
        <div v-if="userData.goals && userData.goals.length > 0">
          <div v-for="goal in userData.goals" :key="goal.goalId" class="goal-container">
            <!-- 확인용 --><!-- goal ::::::::: {{ goal }} -->
            <h3>{{ goal.goalName }}</h3>
            <p>목표 금액: {{ goal.targetCost }}</p>
            <p>시작일: {{ formatDate(goal.goalStartDate) }}</p>
            <p>목표 기간: {{ goal.goalPeriod }} 개월</p>
            <p>누적 금액: {{ goal.accumulatedBalance }}</p>
            <p>상품명: {{ goal.productName }}</p>
          </div>
        </div>
        <p v-else>등록된 목표가 없습니다.</p>   
      </div>

      <div v-else-if="currentPage === 'page3'" class="page-content">
        <h1>과거 목표 조회</h1>
        <div v-if="filteredGoals.length > 0">
          <ul>
            <li v-for="goal in filteredGoals" :key="goal.id">
              <!-- 확인용 --> <!-- goal ::::::::::: {{goal}} -->
              <h3>{{ goal.goalName }}</h3> 
              <p>금액: {{ goal.accumulatedBalance | currencyFormat }}</p>
              <p>시작일자: {{ formatDate(goal.startDate) }}</p>
              <p>종료일자: {{ formatDate(goal.endDate) }}</p>
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
    ...mapGetters(['getToken']),
    filteredGoals() {
      return this.goals.filter(goal => goal.goalSt === 1);
    }
  },
  filters: {
    currencyFormat(value) {
      return `$${value.toFixed(2)}`;
    }
  },
  data() {
    return {
      showConfirmModal: false,
      goals: [],
      pwConfirm: null,
      formData: {
        loginPw: null,
        lifeStage: null
      },
      responseMessage: null,
      responseMessageDeactivate: null,
      currentPage: 'page1',
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
    confirmDeactivateUser() {
      this.showConfirmModal = true; // 확인 대화상자 모달 표시
    },
    cancelDeactivate() {
      this.showConfirmModal = false; // 확인 대화상자 모달 숨김
    },

    showPage(pageName) {
      this.currentPage = pageName;
    },

    async fetchGoals() {
      const url = 'http://localhost:8080/goal/list'
      try {
        const token = this.getToken;
        const response = await axios.get(url, { headers: { Authorization: `${token}` } });
        this.goals = response.data.data;
      } catch (error) {
        console.error('목표 조회 실패:', error);
      }
    },

    async submitForm() {
      if (this.formData.loginPw !== this.pwConfirm) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
      const url = 'http://localhost:8080/user/modify';
      try {
        const token = this.getToken;
        const response = await axios.put(url, this.formData, { headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: token } });
        this.responseMessage = response.data;
        alert('정보가 수정되었습니다.');
        window.location.reload(); // 페이지를 새로고침 - 폼에 입력되어 있는 내용을 없애기 위함
      } catch (error) {
        console.error('Failed to update information:', error);
        this.responseMessage = 'Failed to update information';
      }
    },
    
    async deactivateUser() {
      const url = 'http://localhost:8080/user/deactivate';
      try {
        const token = this.getToken;
        const response = await axios.get(url, { headers: { Authorization: `${token}` } });
        this.responseMessageDeactivate = response.data.message;
        alert('사용자가 비활성화 되었습니다. 변경을 원하시면 고객 센터에 문의하세요');
      } catch (error) {
        console.error('사용자 비활성화 요청 실패:', error);
        this.responseMessageDeactivate = '사용자 비활성화 요청에 실패하였습니다.';
      }
      this.showConfirmModal = false; // 확인 대화상자 모달 숨김
    },

    async fetchGoalData() {
      const url = 'http://localhost:8080/goal/product/list';
      try {
        const token = this.getToken;
        const response = await axios.get(url, { headers: { Authorization: `${token}` } });
        this.userData = response.data.data;
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
  justify-content: space-between;
  margin: 20px;
}

.sidebar {
  width: 150px;
  padding: 20px;
  border-right: 1px solid #ccc;
}

.sidebar-button {
  display: block;
  margin-bottom: 10px;
  width: 100%;
  padding: 8px 12px;
  text-align: left;
}

.content {
  flex: 1;
  padding: 20px;
}

.page-content {
  margin-bottom: 20px;
}

.form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-input {
  width: 100%;
  padding: 8px;
}

.form-select {
  width: 100%;
  padding: 8px;
}

.btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
}

.response-message {
  margin-top: 20px;
  padding: 10px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.goal-container {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
}
</style>
