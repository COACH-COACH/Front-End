<template>
  <div class="all">
    <div class="header-container">
      <div class="title">
        <h1>안녕하세요, {{ goalData.fullName }}님<br/>맞춤형 자산관리 서비스 코치코치입니다.</h1>
      </div> 
      <button v-if="goalData.goals.length < 3" @click="addGoal" class="add-goal-btn">목표 추가</button>
    </div>
    <div v-for="goal in goalData.goals" :key="goal.goalId" class="goal-component">
      <div class="goal-header">
        <h2>{{ goal.goalName }}</h2>
        <p class="start-date detail-text">목표 생성일: {{ formatDate(goal.goalStartDate) }}</p>
      </div>
      <div>
        <p v-if="goal.goalRate >= 100" class="completion-message">
          목표를 달성했어요! 완료 버튼을 클릭해 목표를 종료할 수 있어요.
        </p>
      </div>
      <div class="card">
        <div class="product-state">
          <div class="product-info">
            <div class="product-name">{{ goal.productName }}</div>
          </div>
          <div>
            <div class="actions">
              <button :class="{'goalState': true, 'complete': goal.goalRate >= 100}" @click="goal.goalRate >= 100 ? clickHandler : null">
                {{ checkGoalStatus(goal.goalRate) }}
              </button>
              <button class="productType">{{ goal.depositCycle }}</button>
            </div>
          </div>
        </div>
        <div class="detail-text">
          <p>시작일: {{ formatDate(goal.productStartDate) }}</p>
          <p>현재 금액: {{ numberFormat(goal.accumulatedBalance) }} | 목표 금액: {{ numberFormat(goal.targetCost) }}</p>
        </div>
        <div class="details">
          <div class="serial-number">
            <h2>{{ goal.accountNum }}</h2>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar">
              <div class="progress" :style="{ width: goal.goalRate + '%' }"></div>
            </div>
            <div class="progress-percentage">달성률: {{ goal.goalRate }}%</div>
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
  name: 'GoalComponent',
  props: {
    pid: {
      type: [String, Number],
      required: true
    }
  },
  setup() {
    const store = useStore();
    const token = computed(() => store.getters.getToken);
    const goalData = ref({
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
          goalData.value = data.data;
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

    const numberFormat = (value) => {
      return new Intl.NumberFormat('ko-KR').format(value) + '원';
    };

    const checkGoalStatus = (goalRate) => {
      return goalRate >= 100 ? '완료' : '진행중';
    };

    const addGoal = () => {
      if (goalData.value.goals.length >= 3) {
        alert('목표는 3개까지만 생성이 가능합니다.');
      } else {
        // TODO: 목표 추가 로직
      }
    };
    
    onMounted(fetchGoals);

    return { goalData, fetchGoals, formatDate, numberFormat, checkGoalStatus, addGoal };
  }
};
</script>

<style scoped>
.all {
  max-width: 960px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 20px;
  padding-right: 20px;
}

.title {
  margin-top: 32px;
}

.title h1 {
  margin-bottom: 0; /* 필요한 경우 h2의 마진 조정 */
}

.add-goal-btn {
  float: right;
}

.header-container {
  display: flex;
  align-items: flex-end; /* 요소들의 하단을 서로 맞춤 */
  justify-content: space-between; /* 요소들을 양 끝으로 분산 배치 */
}

.goal-component {
  background: #f0f4f8;
  padding: 16px;
  border-radius: 8px;
  margin: 20px auto;
}

.goal-header {
  display: flex;
  align-items: flex-end;
  background-color: transparent;
  box-shadow: none;
}

.goal-header h2, .goal-header p {
  margin-top: 0;    /* 상단 마진 제거 */
  margin-bottom: 0; /* 하단 마진 제거 */
}

.completion-message {
  color: #007bff;
  font-size: 14px;
}

.start-date {
  margin-left: 8px;
  padding-bottom: 2px;
}

.product-state {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 6px;
  border: transparent; /* 테두리 */
  margin-top: 12px;
}

.product-name {
  font-weight: bold;
}

.product-info {
  flex-grow: 1;
}

.details .date-and-price {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.serial-number {
  margin-top: 8px;
  margin-bottom: 12px;
}

.progress-bar-container {
  position: relative;
  padding-bottom: 14px;
}

.progress-bar {
  background: #e1e1e1;
  border-radius: 6px;
  overflow: hidden;
}

.progress-bar .progress {
  background: #007bff;
  height: 20px;
  width: 0%;
}

.progress-percentage {
  float: right;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 12px;
}

.actions {
  display: flex;
  gap: 10px;
}

/* 상품이 완료 상태일 때 */
.complete, .add-goal-btn {
  border: transparent !important;
  background: #007bff !important;
  color: white !important;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 16px;
}

.actions button {
  border: 1px solid #007bff;
  background-color: #fff;
  color: #007bff;
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 16px;
}

.goalState {
  background: #dc3545;
}

.title > button {
  padding: 10px;
  margin-left: 20px;
}

.productType {
  background: #28a745;
}

.detail-text {
  font-size: 14px;
  color: rgb(57, 57, 57);
}

p {
  margin-bottom: 0px;
  margin-top: 4px;
}

</style>