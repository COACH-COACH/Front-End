<template>
  <div>
    <div class="text-center mb-4">
      <h3>안녕하세요, {{ userData.fullName }}님</h3>
      <p>맞춤형 자산관리 서비스 코치코치입니다.</p>
    </div>
    
    <div class="container mt-5">
      <div class="row">
        <div v-for="goal in userData.goals" :key="goal.goalId" class="col-12 mb-3">
          <div>
            <div class="card-header bg-primary text-white">{{ goal.goalName }}</div>
            <div class="card-body bg-light">
              <div class="row">
                <div class="col-12 col-lg-8">
                  <div class="mb-2">
                    <span class="font-weight-bold">{{ goal.productName }}</span>
                    <span class="ml-2 badge badge-pill badge-light">{{ goal.goalRate }}%</span>
                  </div>
                  <div class="small text-muted">시작일: {{ formatDateLong(goal.goalStartDate) }}</div>
                  <div class="small text-muted">목표금액: {{ goal.accumulatedBalance | currency }}</div>
                  <div class="account-number mt-2">{{ goal.accountNum }}</div>
                </div>
                <div class="col-12 col-lg-4 text-lg-right text-left mt-3 mt-lg-0">
                  <div class="progress mb-2" style="height: 20px;">
                    <div class="progress-bar" :class="{'bg-success': goal.goalRate >= 100}" :style="{ width: goal.goalRate + '%' }" role="progressbar">{{ goal.goalRate }}%</div>
                  </div>
                  <button 
                    class="btn"
                    :class="{ 'btn-danger': goal.goalRate >= 100, 'btn-secondary': goal.goalRate < 100 }"
                    :disabled="goal.goalRate < 100">
                    {{ goal.goalRate >= 100 ? '완료' : '진행중' }}
                  </button>
                </div>
              </div>
              <div class="text-right small mt-2">목표 생성일: {{ formatDate(goal.goalStartDate) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'GoalListComponent',
  props: {
    pid: {
      type: [String, Number],
      required: true
    }
  },
  setup() {
    const store = useStore(); // Vuex 스토어 사용
    const token = computed(() => store.getters.getToken);
    const userData = ref({
      userId: '',
      fullName: '',
      goals: []
    });

    const fetchGoals = async () => {
      if (!token.value) {
        console.error('토큰이 없습니다. 로그인 후 다시 시도해주세요.');
        return;
      }
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/goal/product/list`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token.value}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          userData.value = data.data;
        } else {
          throw new Error(data.responseMessage || '서버에서 데이터를 가져오는데 실패했습니다.');
        }
      } catch (error) {
        console.error('Error fetching goals:', error.message);
      }
    };

    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
    };

    const formatDateLong = (dateStr) => {
      const date = new Date(dateStr);
      return `${date.getFullYear()}년 ${(date.getMonth() + 1)}월 ${date.getDate()}일`;
    };

    onMounted(fetchGoals);

    return { userData, formatDate, formatDateLong, fetchGoals };
  },
  filters: {
    currency(value) {
      if (!value) return '0원';
      return parseInt(value).toLocaleString() + '원';
    },
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
}

.card {
  border-color: #6bb2ff !important; /* 부트스트랩 기본 primary 색상 */
}

.card-header {
  background-color: rgb(139, 195, 255); /* 부트스트랩 기본 primary 색상 */
}

.card-body.bg-light {
  background-color: #f0f8ff; /* 연한 파랑색 배경 */
}

.progress-bar {
  line-height: 20px; /* 프로그레스 바 높이에 맞게 글씨 높이 조정 */
  color: black; /* 프로그레스 바 내 글씨 색상 */
  font-weight: bold;
}

.btn-danger {
  background-color: #dc3545; /* 부트스트랩 기본 danger 색상 */
}

.btn-secondary {
  background-color: #6c757d; /* 부트스트랩 기본 secondary 색상 */
}

.account-number {
  font-weight: bold;
}

.badge-pill {
  font-size: 100%; /* 배지 크기 조정 */
}

.badge-light {
  background-color: #e2e6ea; /* 연한 배경색 */
  color: #343a40; /* 어두운 글씨 색상 */
}
</style>

<style>
/* 전역 스타일에 부트스트랩 추가 */
@import 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css';
</style>
