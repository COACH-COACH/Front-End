<template>
  <div class="product-detail-container">
    <!-- Header Section -->
    <div class="product-detail-header">
      <h2>{{ product.productName }}</h2>
      <div class="interest-rate-box">
        <span class="interest-rate">{{ product.interestRate }}% ~ {{ product.maxInterestRate }}%</span>
        <span class="interest-period">({{ product.maturity }}개월 기준)</span>
      </div>
      <div class="product-meta">
        <div class="meta-item">
          <span class="meta-label">상품유형:</span>
          <span class="meta-value">{{ translatedProductType }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">납입 주기:</span>
          <span class="meta-value">{{ translatedDepositCycle }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">기본 금리:</span>
          <span class="meta-value">{{ product.interestRate }}%</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">최대 금리:</span>
          <span class="meta-value">{{ product.maxInterestRate }}%</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">가입 한도:</span>
          <span class="meta-value">{{ product.limitAmt | currencyFormat }}</span>
        </div>
        <!-- Additional Meta Items -->
      </div>
    </div>
  </div>
  <div class="product-detail-body">
    <div class="product-detail-content">
      <h2 class="section-title">상품 개요</h2>
      <div class="product-description">
        <div class="attributes">
          <div class="attribute-row">
            <span class="attribute-label">상품 설명</span>
            <span class="attribute-value">{{ product.productDetail }}</span>
          </div>
          <div class="attribute-row">
            <span class="attribute-label">예금 과목</span>
            <span class="attribute-value">{{ translatedProductType }}</span>
          </div>
          <div class="attribute-row">
            <span class="attribute-label">저축 방법</span>
            <span class="attribute-value">{{ translatedDepositCycle }}</span>
          </div>
          <div class="attribute-row">
            <span class="attribute-label">최대 금리</span>
            <span class="attribute-value">{{ product.maxInterestRate }}%</span>
          </div>
          <div class="attribute-row">
            <span class="attribute-label">기본 금리</span>
            <span class="attribute-value">{{ product.interestRate }}%</span>
          </div>
          <div class="attribute-row">
            <span class="attribute-label">우대 금리 조건</span>
            <span class="attribute-value">{{ product.preferCondition }}</span>
          </div>
          <div class="attribute-row">
            <span class="attribute-label">만기 기간</span>
            <span class="attribute-value">{{ product.maturity }}개월</span>
          </div>
          <div class="attribute-row">
            <span class="attribute-label">가입 조건</span>
            <span class="attribute-value">{{ product.membershipCondition }}</span>
          </div>
          <div class="attribute-row">
            <span class="attribute-label">가입 대상</span>
            <span class="attribute-value">{{ product.eligibility }}</span>
          </div>
          <div class="attribute-row">
            <span class="attribute-label">주의 사항</span>
            <span class="attribute-value">{{ product.caution }}</span>
          </div>
          <div class="attribute-row">
            <span class="attribute-label">가입 한도</span>
            <span class="attribute-value">{{ product.limitAmt | currencyFormat }}원</span>
          </div>
        </div>
      </div>
    
    <div class="additional-information">
        <div class="attribute-row">
          <span class="attribute-label">자료열람 요구권</span>
          <span class="attribute-value">• 금융소비자는 분쟁조정 또는 소송의 수행 등 권리구제를 위한 목적으로 은행이 기록 및 유지·관리하는 다음의 자료에 대한 열람(사본 및 청취 포함)을 요구할 수 있습니다. <br>
                                            - 계약체결에 관한 자료, 계약의 이행에 관한 자료, 금융상품 등에 관한 광고 자료, 금융소비자의 권리행사에 관한 자료, 내부통제기준의 제정 및 운영 등에 관한 자료, 업무 위탁에 관한 자료 <br>
                                            • 은행은 법령, 제3자의 이익 침해, 영업비밀의 침해 등의 사유가 있는 경우 이를 금융소비자에게 알리고 자료 열람을 제한하거나 거절할 수 있습니다.</span>
        </div>
        <div class="attribute-row"> 
          <span class="attribute-label">위법계약 해지권</span>
          <span class="attribute-value">• 은행이 금융소비자 보호에 관한 법률주1)을 위반하여 계약을 체결한 경우, 금융소비자는 해당 계약 체결에 대한 위반사항을 안 날로부터 1년 이내(단, 계약체결일로부터 5년 이내이고 계약이 종료하기 전일 것)에 서면 등으로 해당 계약의 해지를 요구할 수 있습니다. <br>
                                            • 은행은 그 해지를 요구받은 날로부터 10일 이내에 금융소비자에게 수락 여부를 통지하거나 또는 거절사유와 함께 거절을 통지하여야 하고, 만일 정당한 사유 없이 금융소비자의 계약해지 요구를 따르지 않을 경우 금융소비자는 해당 계약을 해지할 수 있으며, 이에 따라 계약이 해지될 경우 은행은 금융소비자에게 수수료, 위약금 등 비용을 요구할 수 없습니다. <br>
                                            주1) 부적합한 금융상품을 권유한 경우(제17조 제3항), 적정하지 않은 금융상품에 대해 부적정하다는 사실을 알리지 않은 경우(제18조 제2항), 금융상품에 대해 거짓 또는 왜곡하여 설명하거나 중요한 사항에 대한 설명을 누락한 경우(제19조 제1항,3항), 불공정영업행위의 금지(제20조 제1항), 부당권유행위의 금지(제21조)</span>
        </div>
    </div>  
  </div>
  <div class="product-actions">
    <button class="enroll-button" @click="enroll">상품 가입하기</button>
  </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'ProductDetailView',
  props: {
    pid: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
    const store = useStore(); // Vuex 스토어 사용
    const token = computed(() => store.getters.getToken); // Vuex getter 사용
    const router = useRouter();
    const product = ref({});

    // productType, depositCycle 한글로 표시하기
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


    // 데이터를 가져오는 함수
    const fetchProductDetails = async () => {
      try {
        if (!token.value) {
          console.error('토큰이 없습니다. 로그인 후 다시 시도해주세요.');
          return;
        }
        const response = await fetch(`http://localhost:8080/product/detail/${props.pid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token.value}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch product details');
        const data = await response.json();
        product.value = data.data;
      } catch (error) {
        console.error(error);
      }
    };

    // 가입하기 버튼의 로직
    const enroll = () => {
      console.log('상품 가입:', product.value.productName);
      // TODO: 가입 로직

    };

    // 컴포넌트가 마운트될 때 데이터를 로드
    onMounted(fetchProductDetails);

    return {
      product,
      enroll,
      translatedProductType,
      translatedDepositCycle
    };
  }
};
</script>

<style scoped>
.product-detail-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1000px;
  margin: 20px auto;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 20px;
  background: #fff;
}

.product-detail-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1000px;
  margin: 20px auto;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 20px;
  background: #fff;
}

.product-detail-header {
  width: 100%;
  padding-bottom: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.product-detail-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px; /* 컬럼 사이의 간격 조정 */
}

.product-title {
  margin: 0;
  color: #333;
  font-weight: bold;
}

.interest-rate-box {
  display: inline-block;
  background: #eaeaea; /* 배경 색상 조정 */
  padding: 8px 16px;
  border-radius: 16px; /* 둥근 테두리 */
  margin-top: 16px;
}

.interest-rate {
  font-size: 2em;
  color: #d32f2f;
  font-weight: bold;
}

.interest-period {
  margin-left: 10px;
  font-size: 0.8em;
}

.product-description {
  grid-column: span 2;
  font-size: 1em;
  color: #000000;
  border-top: 1px solid #eaeaea;;
  padding-top: 8px 16px;
}

.product-meta {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #eaeaea;
  margin: 20px;
  border-radius: 8px;
}

.meta-item {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.meta-label {
  width: 100px;
  font-weight: bold;
  font-size: 1.1em;
  width: 150px; /* 라벨 너비 조정 */
}

.meta-value {
  flex: 1;
  font-size: 1.1em;
}

.product-actions {
  margin-top: 20px;
  width: 100%;
}

.enroll-button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  display: block; /* 블록 레벨 요소로 만들기 */
  width: 100%; /* 버튼 너비를 부모 요소의 너비와 동일하게 설정 */
  margin-top: 20px;
}

.enroll-button:hover {
  background-color: #0056b3;
}

.attributes {
  display: flex;
  flex-direction: column;
}

.attribute-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5em;
}

.attribute-label {
  font-weight: bold;
  color: #333;
  width: 30%; /* 라벨의 너비 조정 */
}

.attribute-value {
  display: flex;
  text-align: left;
  color: #000000;
  width: 60%; /* 값의 너비 조정 */
}

.additional-information {
  grid-column: span 2; /* 추가 정보가 두 컬럼을 모두 차지하도록 설정 */
  margin-top: 20px;
}

.product-detail-image {
  flex-basis: 250px; /* Adjust size as needed */
  /* Image styling here */
}
</style>