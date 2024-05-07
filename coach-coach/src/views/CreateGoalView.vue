<template>
  <div class="goal-container">
    <div class="goal-banners-wrapper">
      <h2>{{ response.fullName }}님의 저축 목표를 설정해 주세요!</h2>
      <p>{{ response.fullName }}님을 위한 추천 목표입니다📋</p>
      <div class="goal-banners">
        <div
          v-for="category in response.categoryList"
          :key="category.goalName"
          class="goal-banner"
          :class="{ selected: selectedGoal === category.goalName }"
          @click="selectGoal(category.goalName)"
        >
          <img :src="getCategoryImage(category.goalName)" :alt="category.goalName" />
          <div class="banner-overlay">
            <h3>{{ category.goalName }}</h3>
          </div>
        </div>
      </div>
    </div>
    <div class="button-container">
      <button @click="startGoal" :disabled="!selectedGoal" class="confirm-button">확인</button>
      <button @click="cancelGoal" class="cancel-button">취소</button>
    </div>
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

    // 각 목표에 해당하는 이미지를 매핑
    const categoryImages = {
      "내집마련": require('@/assets/house.jpg'),
      "여행": require('@/assets/travel.jpg'),
      "결혼": require('@/assets/marriage.jpg'),
      "자기계발": require('@/assets/self-development.jpg'),
      "학자금": require('@/assets/colleage.jpg'),
      "어학연수": require('@/assets/language-training.jpg'),
      "전자기기": require('@/assets/computer.jpg'),
      "기타목돈": require('@/assets/savings.jpg'),
      "자동차": require('@/assets/car.jpg'),
      "반려동물": require('@/assets/dog.jpg'),
      "자녀": require('@/assets/child.jpg'),
      "투자비용": require('@/assets/invest.jpg'),
      "은퇴자금": require('@/assets/retire.jpg'),
      "건강": require('@/assets/health.jpg'),
      "창업비용": require('@/assets/start-business.jpg'),
      "취미": require('@/assets/hobby.jpg'),
    };

    const getCategoryImage = (goalName) => {
      return categoryImages[goalName] || require('@/assets/lazybee_gray.png'); // 기본 이미지도 설정 가능
    };

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
          categoryList: result.data.categoryList,
        };
      } catch (error) {
        console.error('Error fetching goals:', error.message);
      }
    };

    const selectGoal = (goalName) => {
      selectedGoal.value = selectedGoal.value === goalName ? '' : goalName;
    };

    // 목표 생성
    const startGoal = async () => {
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
    const cancelGoal = () => {
      selectedGoal.value = '';
    };
    return {
      response,
      selectedGoal,
      getCategoryImage,
      selectGoal,
      startGoal,
      cancelGoal,
    };
  }
};
</script>

<style scoped>
.goal-container {
  text-align: center;
}

/* 제목 텍스트 스타일 */
.goal-container h2 {
  font-size: 2em; /* 원하는 폰트 크기로 변경하세요 */
  color: #0262AC; /* 두 번째 이미지처럼 파란색 계열로 변경 */
  margin-bottom: 15px;
  font-weight: bold;
}

/* 부제목 및 설명 텍스트 스타일 */
.goal-container p {
  font-size: 1em; /* 적절한 폰트 크기로 변경하세요 */
  color: #000000; /* 어두운 회색으로 변경 */
  margin-bottom: 20px;
}

.goal-banners-wrapper {
  background-color: #f0f8ff;
  border-radius: 10px;
  padding: 20px;
  margin: 20px 0;
}

.goal-banners {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
  margin-top: 20px;
}

.goal-banner {
  position: relative;
  width: 250px;
  height: 350px;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-top:20px;
}

.goal-banner.selected {
  border: 3px solid #007bff;
}

.goal-banner:hover {
  transform: translateY(-5px);
}

.goal-banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-overlay {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: rgba(0, 103, 172, 0.8);
  /* background: rgba(0, 0, 0, 0.5); */
  color: white;
  text-align: center;
  padding: 3px 0;
  font-size: 1.2em;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.confirm-button,
.cancel-button {
  padding: 10px 30px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
}

.confirm-button {
  background-color: #007bff;
  color: white;
}

.confirm-button:disabled {
  background-color: #b0c4de;
  cursor: not-allowed;
}

.confirm-button:hover:enabled {
  background-color: #0056b3;
}

.cancel-button {
  background-color: #f0f0f0;
}

.cancel-button:hover {
  background-color: #dcdcdc;
}
</style>