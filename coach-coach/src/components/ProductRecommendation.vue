<template>
  <div class="container">
    <!--로딩 메시지-->
    <div v-if="isLoading" class="loading-message">
      <h1> 고객님 맞춤 예적금 상품을 찾고 있습니다! <br> 잠시만 기다려주세요... </h1>
    </div>
  
    <template v-else>
      <div v-if="itemRecommendations.length > 0 && clusterRecommendations.length > 0">
        <h1>고객님의 과거 상품과 유사한 상품을 추천해드려요</h1>
        <div class = "banner-container">
          <div class="banner" v-for="item in itemRecommendations" :key="item.idPk" 
          @click="goToProductDetail(item.idPk)">
            <div class="product-name"> {{ item.productName }} </div>
            <div class="interest-rate">최대금리 : {{ item.maxInterestRate }}%</div>
            <div class="maturity">가입기간 : {{ item.maturity }}개월</div>
          </div>
        </div>

        <h1>고객님과 비슷한 특징을 가지고 계신 고객님들이 많이 찾은 상품이에요</h1>
        <div class = "banner-container">
          <div class="banner" v-for="cluster in clusterRecommendations" :key="cluster.idPk"
          @click="goToProductDetail(clsuter.idPk)">
            <div class="product-name"> {{ cluster.productName }} </div>
            <div class="interest-rate">최대금리 : {{ cluster.maxInterestRate }}%</div>
            <div class="maturity">가입기간 : {{ cluster.maturity }}개월</div>
          </div>
        </div>
      </div>

      <div v-else-if="itemRecommendations.length > 0">
        <h1>고객님의 과거 상품과 유사한 상품을 추천해드려요</h1>
        <div class = "banner-container">
          <div class="banner" v-for="item in itemRecommendations" :key="item.idPk"
          @click="goToProductDetail(item.idPk)">
            <div class="product-name"> {{ item.productName }} </div>
            <div class="interest-rate">최대금리 : {{ item.maxInterestRate }}%</div>
            <div class="maturity">가입기간 : {{ item.maturity }}개월</div>
          </div>
        </div>
      </div>

      <div v-else-if="staticRecommendations.length > 0">
        <h1>고객님과 같은 생애주기를 지나고 있는 다른 고객님들이 많이 찾은 상품이에요</h1>
        <div class = "banner-container">
          <div class="banner" v-for="statics in staticRecommendations" :key="statics.idPk"
          @click="goToProductDetail(statics.idPk)">
            <div class="product-name"> {{ statics.productName }} </div>
            <div class="interest-rate">최대금리 : {{ statics.maxInterestRate }}%</div>
            <div class="maturity">가입기간 : {{ statics.maturity }}개월</div>
          </div>
        </div>
      </div>

      <div v-else>
        <h1 class="no-product">상품을 찾을 수 없습니다</h1>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  computed : {
    ...mapGetters(['getToken']) // Vuex의 getToken getter를 컴포넌트 내에서 사용 가능하게 등록
  },
  data() {
    return {
      itemRecommendations: [],
      clusterRecommendations: [],
      staticRecommendations: [],
      adminResponse: null,
      isLoading: true
    };
  },
  created() {
    this.fetchRecommendations();
  },
  methods: {
    goToProductDetail(idPk){
      this.$router.push({ name: 'productdetail', params: { pid:idPk }});
    },
    async fetchRecommendations() {
      const url = 'http://localhost:8080/product/recommend'; // API의 URL을 여기에 입력하세요

      try {
        const token = this.getToken; // Vuex 스토어에서 토큰 가져오기

        if (!token) {
          console.error('토큰이 없습니다. 로그인 후 다시 시도해주세요.');
          return;
        }

        this.isLoading = true;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `${token}`, // HTTP 요청 헤더에 토큰 포함
            'Content-Type': 'application/json'
          }
        });
        this.isLoading = false;
        this.adminResponse = response.data; // Admin 페이지 응답 저장
        const data = await response.json();
        console.log('Received data:', data);
        if (data) {
          this.itemRecommendations = data.itemRecommendations || [];
          this.clusterRecommendations = data.clusterRecommendations || [];
          this.staticRecommendations = data.staticRecommendations || [];
          
          console.log('Item Recommendations:', this.itemRecommendations);
          console.log('Cluster Recommendations:', this.clusterRecommendations);
          console.log('Static Recommendations:', this.staticRecommendations);
        }

      } catch (error) {
        console.error('Admin 페이지 접속 실패:', error);
      }

    }
  }
}
</script>

<style>
/* 전체 컨테이너 */
.container {
  max-width: 1200px;
  margin: auto;
}

/* 로딩 애니메이션 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.loading-animation {
  text-align: center;
  animation: pulse 2s infinite;
}

/* keyframes for the animation */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* 상품 추천 섹션 */
.recommendation-section {
  margin-top: 20px;
}

/* 배너 스타일 */
.banner-container {
  display: flex;
  flex-direction:row;
  width: 100%;
  overflow-x: auto;
  padding: 10px 0;
}

.banner {
  flex: 0 0 auto;
  margin-right: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease-in-out;
}

.banner:hover {
  transform: translateY(-5px);
}

.product-name {
  background-color: #f5f5f5;
  padding: 12px 16px;
  margin: 0;
  font-size: 1.1em;
  font-weight: bold;
}

.interest-rate {
  color: #d32f2f;
  padding: 8px 16px;
  margin: 0;
  font-size: 1.5em;
  font-weight: bold;
}

.maturity {
  background-color: #fafafa;
  padding: 10px 16px;
  margin: 0;
  font-size: 1em;
}
</style>