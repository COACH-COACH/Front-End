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
      <!-- 상품 -->
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
        <div class="serial-number">
          <h2>{{ goal.accountNum }}</h2>
        </div>
        <!-- 진행률 바 -->
        <div class="progress-bar-container">
          <div class="progress-bar">
            <div class="progress" :style="{ width: goal.goalRate + '%' }">
              <div class="progress-percentage">{{ goal.goalRate }}%</div>
            </div>
          </div>
        </div>
        <!-- 실천방안 -->
        <div v-if="goal.depositCycle === '자유적금'" :class="{'action-plan': true, 'null-plan': goal.actionPlan == null, 'non-null-plan': goal.actionPlan != null}">
          <div v-if="goal.actionPlan == null">
            <p>실천방안이 없어요. 실천방안 추가하러 갑시다.</p>
          </div>
          <div v-else>
            <p class="action-plan-title">자유적금 실천방안</p>
            {{ goal.actionPlan }} <br/>
            금액: {{ numberFormat(goal.depositAmt) }} <br/>
            <!-- {{ formatDate(goal.depositStartDate) }} <br/> -->
            단위: {{ goal.depositAmtCycle }}일 마다 <br/>
            누적 입금 횟수: {{ goal.totalCount }}회<br/>
            마지막 입금일: {{ formatDate(goal.lastDepositDate) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

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
    const router = useRouter();
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
        router.push('/main/goal/new');
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

.date-and-price {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.serial-number {
  margin-top: 8px;
  margin-bottom: 12px;
}

.progress-bar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-bar {
  background: #e1e1e1;
  border-radius: 10px;
  overflow: hidden;
  position: relative; /* progress-percentage를 상대적으로 위치시키기 위함 */
  flex-grow: 1;
}

.progress {
  background: #007bff;
  height: 24px;
  width: 0%; /* 실제 값은 Vue.js 바인딩을 통해 설정됩니다. */
  position: relative;
  z-index: 1;
}

.progress-percentage {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  margin-right: 8px; /* 우측 가장자리와의 거리 */
  color: white; /* 텍스트 색상을 흰색으로 변경 */
  z-index: 2;
  font-size: 12px;
  font-weight: bold; /* 가독성을 위해 글씨체를 굵게 설정 */
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
.complete:hover, .add-goal-btn:hover {
  background-color: #0056b3; /* 버튼의 hover 상태에 적용될 배경색을 더 진한 파란색으로 설정. */
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

/* 자유적금일 때 실천방안의 상태에 따른 배경색 설정 */
.action-plan {
  margin-top: 16px;
  border-radius: 10px;
  padding: 16px;
}

/* actionPlan이 null일 때 */
.action-plan.null-plan {
  background-color: #d9d9d9; /* 회색 배경 */
}

/* actionPlan이 null이 아닐 때 */
.action-plan.non-null-plan {
  background-color: #ffe8c3; /* 연노랑색 배경 */
}

.action-plan-title {
  font-weight: bold;
  margin-bottom: 4px;
}

</style>