<template>
  <div class="container">
    <h2>목표 생성하기</h2>
    <p>{{ response.fullName }}님을 위한 추천 목표입니다.</p>
    <div class="button-container">
      <button v-for="category in response.categoryList" :key="category.goalName"
        :class="{ 'selected': selectedGoal === category.goalName }" @click="selectGoal(category)">
        {{ category.goalName }}
      </button>
    </div>
    <button :disabled="!selectedGoal" @click="startGoal" class="create-button">목표 추가</button>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'CreateGoalView',
  setup() {
    const store = useStore();
    const token = computed(() => store.getters.getToken);
    const response = ref({
      fullName: '',
      categoryList: []
    });
    const selectedGoal = ref('');

    onMounted(() => {
      fetchGoals();
    });

    const fetchGoals = async () => {
      try {
        const res = await fetch(process.env.VUE_APP_API_URL + '/goal/category', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token.value}`
          }
        });
        const result = await res.json();
        response.value = {
          fullName: result.data.fullName,
          categoryList: result.data.categoryList
        };
      } catch (error) {
        console.error('Error fetching goals:', error.message);
      }
    };

    const selectGoal = (category) => {
      selectedGoal.value = selectedGoal.value === category.goalName ? '' : category.goalName;
    };

    // 목표 생성
    const startGoal = async () => {
      console.log('Selected Goal:', selectedGoal.value);

      try {
        const response = await fetch(process.env.VUE_APP_API_URL + '/goal/regist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token.value}`
          },
          body: JSON.stringify({
            goalName: selectedGoal.value
          })
        });

        const result = await response.json();

        if (response.ok) {
          console.log('Goal registration successful:', result);
          window.history.back(); // 성공적으로 목표를 등록한 후 이전 페이지로 돌아감
        } else {
          console.error('Goal registration failed:', result);
          alert('목표 등록에 실패했습니다.');
        }
      } catch (error) {
        console.error('Network error:', error);
        alert('네트워크 오류가 발생했습니다.');
      }
    };

    return {
      response,
      selectedGoal,
      selectGoal,
      startGoal
    };
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.button-container button {
  background-color: white;
  border: 1px solid #ccc;
  padding: 8px;
  margin: 5px;
  cursor: pointer;
  width: 280%; /* 가로 길이 늘리기 */
  border-radius: 15px; /* border radius 추가 */
}

.button-container button:hover {
  background-color: #f0f0f0;
}

.create-button {
  margin-top: 32px;
  background-color: rgb(34, 66, 164);
  border: 1px solid #ccc;
  padding: 10px 100px 10px 100px;
  color: white;
  border-radius: 15px;
}

.selected {
  background-color: #007bff !important;
  color: white;
}
</style>
