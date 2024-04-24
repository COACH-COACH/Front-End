<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <!-- 목표 선택 드롭다운 -->
      <div class="input-group">
        <label for="goal-select">연동하실 목표를 선택해 주세요</label>
        
          <select id="goal-select" v-model="selectedGoalId" v-if="goals && goals.length">
            
            <option v-for="goal in goals" :key="goal.goalId" :value="goal.goalId">
              목표명 : {{ goal.goalName }} <br>
              목표 금액 : {{ goal.targetCost ? `${goal.targetCost}원` : '목표 금액 없음' }} <br>
              목표 시작일 : {{ goal.startDate }} <br>
            </option>
          </select>
        <p v-else>목표가 없습니다. 목표를 먼저 생성해 주세요.</p>
        <!-- 목표 없을 때 목표 만드는 페이지로 이동하는 버튼 만들기 -->
      </div>

      <!-- 예치금 입력 필드 -->
      <div class="input-group">
        <label for="deposit-amount">정기 입금액:</label>
        <input id="deposit-amount" type="number" v-model="depositAmount" placeholder="예치금을 입력하세요">
      </div>

      <!-- 첫 입금액 입력 필드 -->
      <div class="input-group">
        <label for="first-deposit">첫 입금액:</label>
        <input id="first-deposit" type="number" v-model="firstDeposit" placeholder="첫 입금액을 입력하세요">
      </div>

      <!-- 가입하기 버튼 -->
      <button class="submit-button" @click="registerProduct">가입하기</button>
      <button @click="closeModal">닫기</button>
    </div>
  </div>
</template>


<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'RegisterModal',
  props: {
    product: {
      type: Array,
      required: true
    },
    goals: {
      type: Array,
      required: true
    }
  },
  created() {
    console.log(this.goals); // 모달이 생성될 때 현재 goals 배열을 로그
    console.log(this.product);
  },
  methods: {
    closeModal() {
      this.$emit('close');
    }
  },
  
  setup(props) {
    const store = useStore(); // Vuex 스토어 사용
    const token = computed(() => store.getters.getToken); // Vuex getter 사용
    const router = useRouter();

    const selectedGoalId = ref(''); // 선택된 목표의 ID
    const depositAmount = ref(0); // 사용자가 입력한 예치금
    const firstDeposit = ref(0); // 사용자가 입력한 첫 입금액

    // 가입 상품 등록
    const registerProduct = async() => {
      console.log(`Attempting to register product with goal ID: ${selectedGoalId.value}`);

        try {
            if (!token.value) {
                console.error('토큰이 없습니다. 로그인 후 다시 시도해주세요.');
                return;
            }
            if (!selectedGoalId.value) {
                alert('목표를 선택해주세요.');
                return;
            }
            else if (!depositAmount.value || !firstDeposit.value) {
                alert('정기입금액과 초기 입금액을 입력해 주세요.');
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

        if (!response.ok) throw new Error('Failed to fetch register product');
        // 등록 후 처리 로직
        alert('상품이 성공적으로 가입되었습니다.');
      } catch (error) {
        console.error(error);
        alert('상품 가입에 실패했습니다. 다시 시도해 주세요.');
      }
    }

    return {
      // goals,
      selectedGoalId,
      depositAmount,
      firstDeposit,
      registerProduct
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
}

.modal-container {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  width: fit-content;
}
</style>