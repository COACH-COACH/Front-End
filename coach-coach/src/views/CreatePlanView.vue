<template>
  <div class="all">
    <!-- 상단 -->
    <div class="background-color">
      <div class="description layout-margin">
        <!-- 좌측 타이틀 -->
        <div class="title">
          <h2 class="blue-text">{{ planDetails.fullName }}님의 목표 실천 방법을<br />설정해 보세요🔥</h2>
          <p>{{ planDetails.fullName }}님의 목표에 대해 계산해 보았어요</p>
          <img class="resize-image" :src="titleWibeeSrc" alt="캐릭터 이미지">
        </div>
        <!-- 우측 카드 -->
        <div class="card">
          <div class="card-title">
            <h3>나의 목표는?</h3>
            <h1>{{ planDetails.goalName }}</h1>
          </div>
          <img :src="cardWibeeSrc" alt="캐릭터 이미지">
          <div class="card-content">
            <p class="blue-text"><b>현재 나는?</b></p>
            <ul>
              <li>목표 금액: {{ numberFormat(planDetails.targetAmt) }}</li>
              <li>잔여 금액: {{ numberFormat(planDetails.remainAmt) }}</li>
              <li>잔여 기간: {{ formatDuration(planDetails.remainDay) }}</li>
            </ul>
            <p class="blue-text"><b>목표 금액까지</b></p>
            <ul>
              <li>매달 {{ numberFormat(planDetails.monthlyReqAmt) }}</li>
              <li>매주 {{ numberFormat(planDetails.weeklyReqAmt) }}</li>
              <li>매일 {{ numberFormat(planDetails.dailyReqAmt) }} 모으면 달성할 수 있어요</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 하단 -->
    <div class="booking layout-margin">
      <h2 class="blue-text">어떤 저축 방식으로<br />목표를 달성하시겠어요?📊</h2>
      <div class="form-grid">
        <div>
          <label for="start-date">저축 시작일을 선택해 주세요</label>
          <input type="date" id="start-date">
        </div>
        <div>
          <label for="method">저축 주기를 선택해 주세요</label>
          <select id="method">
            <option value="1">매일</option>
            <option value="7">매주</option>
            <option value="30">매달</option>
          </select>
        </div>
        <div>
          <label for="saving-method">어떤 방식으로 저축하시겠어요?</label>
          <select id="saving-method" v-model="selectedMethod" @change="onChangeMethod">
            <option selected>커피 줄이기☕</option>
            <option>점심 아끼기🍱</option>
            <option>배달 줄이기🏍</option>
            <option>편의점 줄이기🍙</option>
            <option>쇼핑 줄이기👕</option>
          </select>
        </div>
        <div class="input-wrapper">
          <label for="amount">얼마나 저축하시겠어요?</label>
          <div class="input-with-unit">
            <input type="text" id="amount">
            <span class="unit">원</span>
          </div>
        </div>
      </div>

      <div class="button-group">
        <button class="create-btn" @click="clickAddPlan">추가</button>
        <button class="cancel-btn" @click="back">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'CreatePlanView',
  props: {
    enrollId: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const titleWibeeSrc = ref(require('@/assets/wibee_hat.png'));
    const cardWibeeSrc = ref(require('@/assets/webee-removebg-preview.png'));

    const store = useStore();
    const token = computed(() => store.getters.getToken);
    const router = useRouter();

    const planDetails = ref({
      fullName: '',
      goalName: '',
      targetAmt: 0,
      remainAmt: 0,
      remainDay: 0,
      monthlyReqAmt: 0,
      weeklyReqAmt: 0,
      dailyReqAmt: 0
    });
    
    const fetchPlanDetails = async () => {
      if (!token.value) {
        console.error('토큰이 없습니다. 로그인 후 다시 시도해주세요.');
        return;
      }
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/plan/${props.enrollId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token.value}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          planDetails.value = data.data;
        } else {
          throw new Error(data.responseMessage);
        }
      } catch (error) {
        console.error('실천방안 조회 실패', error.message);
      }
    };

    const numberFormat = (value) => {
      const rounded = Math.ceil(value / 10) * 10;
      return new Intl.NumberFormat('ko-KR').format(rounded) + '원';
    };

    const formatDuration = (days) => {
      const years = Math.floor(days / 365);
      const months = Math.floor((days % 365) / 30);
      const remainingDays = days % 30;
      let result = '';
      if (years > 0) result += `${years}년 `;
      if (months > 0) result += `${months}개월 `;
      if (remainingDays > 0) result += `${remainingDays}일`;
      return result || '0일'; // Return '0일' if all are zero
    };

    const clickAddPlan = () => {
      const depositStartDate = document.getElementById('start-date').value;
      const depositAmtCycle = document.getElementById('method').value;
      const selectedMethod = document.getElementById('saving-method').value;
      const depositAmt = document.getElementById('amount').value;
      const actionPlan = selectedMethod.replace(/[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FB00}-\u{1FBFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+/gu, '').trim();
      
      if (!depositStartDate || !depositAmtCycle || !depositAmt || !actionPlan) {
        alert("모든 필드를 채워주세요.");
      } else {
        createActionPlan(depositStartDate, depositAmtCycle, actionPlan, depositAmt);
      }
    };

    const createActionPlan = async (depositStartDate, depositAmtCycle, actionPlan, depositAmt) => {
      if (!token.value) {
        console.error('토큰이 없습니다. 로그인 후 다시 시도해주세요.');
        return;
      }
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/plan/${props.enrollId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token.value}`
          },
          body: JSON.stringify({
            depositStartDate: depositStartDate, 
            depositAmtCycle: depositAmtCycle, 
            actionPlan: actionPlan, 
            depositAmt: depositAmt
          })
        });
        const data = await response.json();
        if (response.ok) {
          back();
        } else {
          throw new Error(data.responseMessage);
        }
      } catch (error) {
        console.error('실천방안 추가 실패', error.message);
        alert(error.message);
      }
    };

    const back = () => {
      router.push({ name: 'goal' });
    }

    onMounted(() => {
      fetchPlanDetails();
    });
    
    return { titleWibeeSrc, cardWibeeSrc, planDetails, numberFormat, formatDuration, clickAddPlan, back };
  }
}
</script>

<style scoped>
.background-color {
  background-color: #EAF5FD;
}

.blue-text {
  color: #0262AC;
}

.layout-margin {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  padding: 0px 30px 0px 30px;
}

.description {
  padding-top: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.resize-image {
  width: 150px;
  height: auto;
}

.card {
  text-align: left;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(149, 149, 149, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  /* 포지셔닝 컨텍스트 설정 */
  width: 100%;
  padding: 0px 18px 0px 18px;
  max-width: 320px;
}

.card-title {
  width: 100%;
  /* 부모의 전체 너비 */
  border-radius: 20px 20px 0px 0px;
  background-color: #0262AC;
  color: white;
  padding: 0px 18px 0px 18px;
  z-index: 0;
  /* 이미지보다 위에 오도록 설정 */
}

.card-content {
  width: 100%;
  border-radius: 0px 0px 20px 20px;
  background-color: white;
  padding: 0px 18px 0px 18px;
  z-index: 0;
}

.card img {
  width: 100px;
  height: auto;
  position: absolute;
  /* 절대 위치 */
  top: 30%;
  /* 상위 요소(.card) 기준으로 위에서 50% 위치 */
  left: 80%;
  /* 좌우 중앙 정렬을 위해 50% 설정 */
  transform: translate(-50%, -50%);
  /* 정확한 중앙 정렬을 위해 변환 */
  z-index: 1;
  /* 이미지를 가장 위로 보냄 */
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px; /* Increased gap between grid items */
}

.input-with-unit {
  display: flex;
  align-items: center;
  position: relative;
}

.input-with-unit .unit {
  position: absolute;
  right: 10px;
  pointer-events: none;
}

.input-with-unit input {
  width: 100%;
  padding-right: 30px;
}

.booking .button-group {
  display: flex;
  justify-content: center;
  /* Center buttons horizontally */
  gap: 10px;
  /* Space between buttons */
}

.booking input[type="date"],
.booking input[type="text"],
.booking select {
  width: 100%;
  /* Full width inputs */
  padding: 8px;
  /* Padding inside inputs */
  margin-top: 5px;
  /* Space above inputs */
  border: 1px solid #ccc;
  /* Border around inputs */
  border-radius: 4px;
  /* Rounded borders for inputs */
}

.create-btn{
  background-color: #0262AC;
}

.cancel-btn {
  color: #3c474f !important;
}

.booking button {
  margin-top: 46px;
  padding: 10px 20px;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 10px;
}

.button-group button {
  min-width: 100px;
}



</style>