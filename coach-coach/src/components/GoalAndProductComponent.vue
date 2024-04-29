<template>
  <div class="all">
    <div class="title">
      <h2>안녕하세요, {{ goalData.fullName }}님</h2>
      <h2>맞춤형 자산관리 서비스 코치코치입니다.</h2>
    </div>  
    <div v-for="goal in goalData.goals" :key="goal.goalId" class="goal-component">
      <div class="header">
        <h3>{{ goal.goalName }}</h3>
        <span class="start-date detail-text">생성일: {{ goal.goalStartDate }}</span>
      </div>
      <div class="card">
        <div class="product-state">
          <div class="product-info">
            <div class="product-name">{{ goal.productName }}</div>
          </div>
          <div>
            <div class="actions">
              <button class="goalState">진행중</button>
              <button class="productType">정기적금</button>
            </div>
          </div>
        </div>
        <div class="detail-text">
          <p>시작일: {{ goal.productStartDate }}</p>
          <p>현재 금액: {{ goal.accumulatedBalance }} | 목표 금액: {{ goal.targetCost }}</p>
        </div>
        <div class="details">
          <div class="serial-number">
            <h4>{{ serialNumber }}</h4>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar">
              <div class="progress" :style="{ width: goal.goalRate + '%' }"></div>
            </div>
            <div class="progress-percentage">{{ goal.goalRate }}%</div>
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
    const store = useStore(); // Vuex 스토어 사용
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
    onMounted(fetchGoals);
    return { goalData, fetchGoals };
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

.goal-component {
  background: #f0f4f8;
  padding: 16px;
  border-radius: 8px;
  margin: 20px auto;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  background-color: transparent;
  box-shadow: none;
}

.start-date {
  margin-left: 8px;
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
}

.progress-bar {
  background: #e1e1e1;
  border-radius: 6px;
  overflow: hidden;
}

.progress-bar .progress {
  background: #007bff;
  height: 10px;
  width: 0%;
}

.progress-percentage {
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 10px 5px;
  font-size: 12px;
}

.actions {
  display: flex;
  gap: 10px;
}

.actions button {
  border: 1px solid #007bff;
  background-color: #fff;
  color: #007bff;
  padding: 5px 10px;
  border-radius: 10px;
  font-size: 16px;
}

.goalState {
  background: #dc3545;
}

.productType {
  background: #28a745;
}

.detail-text {
  font-size: 12px;
  color: rgb(57, 57, 57);
}

p {
  margin-bottom: 0px;
}

</style>