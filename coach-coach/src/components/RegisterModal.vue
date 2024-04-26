<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <!-- 상품 요약 설명 -->
      <h2>가입하실 상품입니다✨</h2>
      <div class="product-summary">
        <h3>{{ product.productName }}</h3>
        <p>최대 금리: {{ product.maxInterestRate }}</p>
        <p>상품 유형: {{ translatedProductType }}</p>
        <p>저축 방법: {{ translatedDepositCycle }}</p>
      </div>

      <!-- 목표 선택 드롭다운 -->
      <div class="input-group">
        <label for="goal-select">연동하실 목표를 선택해 주세요</label>
          <select id="goal-select" v-model="selectedGoalId" v-if="goals && goals.length > 0">
            <option v-for="goal in goals" :key="goal.goalId" :value="goal.goalId">
              목표명 : {{ goal.goalName }} <br>
              목표 금액 : {{ goal.targetCost ? `${goal.targetCost}원` : '목표 금액 없음' }} <br>
              목표 시작일 : {{ goal.startDate }} <br>
            </option>
          </select>
          
          <p v-else>{{ goalsStatusMessage }}</p>
          <!-- 목표 없을 때 목표 만드는 페이지로 이동하는 버튼 만들기 -->
          <button v-if="goalsStatusMessage === '목표가 없습니다. 목표를 생성해 보세요!'" @click="goToGoalCreation">목표 생성하러 가기</button>
      </div>

      <!-- 정기 입금액 입력 필드 -->
      <div class="input-group" v-if="(goals && goals.length > 0) && (product.productType === '적금' ||  product.productType === 'SAVINGS') && (product.depositCycle != '자유적립식' || product.depositCycle != 'FLEXIBLE') ">
        <label for="deposit-amount">정기 입금액:</label>
        <input id="deposit-amount" type="number" v-model="depositAmount" placeholder="매달 입금하실 금액을 입력하세요">
      </div>

      <!-- 예치금 입력 필드 -->
      <div class="input-group" v-else-if="(goals && goals.length > 0) && (product.productType === '예금' || product.productType === 'DEPOSIT')">
        <label for="deposit-amount">예치금:</label>
        <input id="deposit-amount" type="number" v-model="depositAmount" placeholder="예금에 예치하실 금액을 입력하세요">
      </div>

      <!-- 첫 입금액 입력 필드 -->
      <div class="input-group" v-if="(goals && goals.length > 0)">
        <label for="first-deposit">첫 입금액:</label>
        <input id="first-deposit" type="number" v-model="firstDeposit" placeholder="첫 입금액을 입력하세요">
      </div>

      <error-modal :show="showModal" @close="closeModal">
        <template v-slot:header>
          상품 가입에 실패했습니다
        </template>
        <template v-slot:body>
          {{ errorMessage }}
        </template>
      </error-modal>

      <!-- 가입하기 버튼 -->
      <button class="submit-button" @click="registerProduct" v-if="(goals && goals.length > 0)">가입하기</button>
      
      <button @click="closeModal">닫기</button>
      </div>
  </div>
  
</template>


<script>
import ErrorModal from '../components/ErrorModal.vue';
import { ref, toRefs, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'RegisterModal',
  components: {
    ErrorModal
  },
  props: {
    product: {
      type: Object,
      required: true
    },
    goals: {
      type: Array,
      required: true
    },
    goalsStatusMessage: {
      type: String,
      default: ''
    }
  },
  created() {
    console.log(this.goals); // 모달이 생성될 때 현재 goals 배열을 로그
    console.log(this.product);
    console.log(this.goalsStatusMessage);
  },
  
  methods: {
    closeModal() {
      this.$emit('close');
    }
    // Vue Router를 사용해서 목표 생성 경로로 이동
    // goToGoalCreation() {
    // this.$router.push('/path-to-goal-creation');
  // }
  },
  
  setup(props) {
    const store = useStore(); // Vuex 스토어 사용
    const token = computed(() => store.getters.getToken); // Vuex getter 사용
    const router = useRouter();
    const selectedGoalId = ref(''); // 선택된 목표의 ID
    const depositAmount = ref(0); // 사용자가 입력한 예치금
    const firstDeposit = ref(0); // 사용자가 입력한 첫 입금액
    const { product } = toRefs(props);
    const showModal = ref(false);
    const errorMessage = ref('');
    
    const translatedProductType = computed(() => {
      if (product.value.productType === 'SAVINGS') return '적금';
      if (product.value.productType === 'DEPOSIT') return '예금';
      return product.value.productType; // 기본값이나 다른 타입 처리
    });

    const translatedDepositCycle = computed(() => {
      if (product.value.depositCycle === 'FIXED') return '정액적립식';
      if (product.value.depositCycle === 'FLEXIBLE') return '자유적립식';
      if (product.value.depositCycle === 'HOLD') return '거치식';
      return product.value.depositCycle; // 기본값이나 다른 타입 처리
      });  


    // 가입 상품 등록
    const registerProduct = async() => {
      console.log(`Attempting to register product with goal ID: ${selectedGoalId.value}`);

      try {
      if (!token.value) {
        console.error('로그인 후 다시 시도해주세요.');
        errorMessage.value = '로그인 후 다시 시도해주세요.';
        showModal.value = true;
        return;
      } else if (!selectedGoalId.value) {
        errorMessage.value = '목표를 선택해주세요.';
        showModal.value = true;
        return;
      } else if (!depositAmount.value || !firstDeposit.value) {
        errorMessage.value = '정기입금액과 초기 입금액을 입력해 주세요.';
        showModal.value = true;
        return;
      } else if (depositAmount.value < 1000) {
        errorMessage.value = `${translatedProductType.value} 입금액은 1000원 이상이어야 합니다.`;
        showModal.value = true;
        return;
      } else if (firstDeposit.value < 1000 || firstDeposit.value > product.value.limitAmt) {
        errorMessage.value = `첫 입금액은 1000원 이상 ${product.value.limitAmt}원 이하이어야 합니다.`;
        showModal.value = true;
        return;
      }

        // POST 요청의 body 데이터 구성
        const postData = {
          selectedGoalId: selectedGoalId.value,
          depositAmount: depositAmount.value,
          firstDeposit: firstDeposit.value
        };

        const productId = typeof props.product.idPk === 'string' ? props.product.idPk : props.product.id;
        const response = await fetch(`http://localhost:8080/product/register/${ productId }/${ selectedGoalId.value }`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token.value}`
          },
          body: JSON.stringify(postData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || '상품 등록에 실패했습니다.');
        }
        
        // 여기에 성공 시 필요한 로직을 추가합니다.
        errorMessage.value = '상품이 성공적으로 가입되었습니다.';
        showModal.value = true;

      } catch (error) {
        console.error(error);
        errorMessage.value = `상품 가입에 실패했습니다. ${error.message} 다시 시도해 주세요.`;
        showModal.value = true;
      }
    };

    return {
      // goals,
      selectedGoalId,
      depositAmount,
      firstDeposit,
      registerProduct,
      translatedProductType,
      translatedDepositCycle,
      showModal,
      errorMessage,
      registerProduct,
      // closeModal
      // closeErrorModal
    };
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.modal-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 90%;
  max-width: 500px;
  transform: translateY(-20px);
  animation: slideIn 0.3s ease forwards;
}

@keyframes slideIn {
  to {
    transform: translateY(0);
  }
}

.input-group {
  margin-bottom: 20px;
}

input[type="number"] {
  width: 100%;
  padding: 10px;
  margin-top: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

label {
  display: block;
  font-weight: bold;
}

button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #5b88fa;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 10px;
}

button:hover {
  background-color: #4677f8;
}

button:active {
  background-color: #3b61d1;
}

.submit-button {
  width: 100%;
  margin-top: 20px;
  font-size: 16px;
}

.product-summary {
  text-align: center;
  padding: 10px;
  margin-bottom: 30px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.product-summary h3 {
  margin-top: 0;
}

.product-summary p {
  margin: 5px 0;
}

/* 추가 버튼 스타일링 */
button:not(.submit-button) {
  background: none;
  color: #5b88fa;
  padding: 5px 10px;
  border: 1px solid #5b88fa;
}

button:not(.submit-button):hover {
  background: #5b88fa;
  color: white;
  border-color: #5b88fa;
}
</style>
