<template>
  <div class="container">
    <!--로딩 메시지-->
    <div v-if="isLoading" class="loading-overlay">
      <img src="@/assets/loading.gif" alt="고객님 맞춤 예적금 상품을 찾고 있습니다! 잠시만 기다려주세요..." />
    </div>
  
    <template v-else>
      <div v-if="itemRecommendations.length > 0 && clusterRecommendations.length > 0">
        <h2> <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" style="color: #B197FC;" /> 고객님의 과거 상품과 유사한 상품을 추천해드려요</h2>
        <div class = "banner-container">
          <div class="card" v-for="item in itemRecommendations" :key="item.idPk" 
          @click="goToProductDetail(item.idPk)">
            <div class="card-title"> {{ item.productName }} </div>
            <div class="interest-rate">최대금리 : <span class="highlight_card">{{ item.maxInterestRate }}</span>%</div>
            <div class="maturity">가입기간 : {{ item.maturity }}개월</div>
          </div>
        </div>

        <h2> <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" style="color: #B197FC;" /> 고객님과 비슷한 특징을 가지고 계신 고객님들이 많이 찾은 상품이에요</h2>
        <div class = "banner-container">
          <div class="card" v-for="cluster in clusterRecommendations" :key="cluster.idPk"
          @click="goToProductDetail(cluster.idPk)">
            <div class="card-title"> {{ cluster.productName }} </div>
            <div class="interest-rate">최대금리 : <span class="highlight_card">{{ cluster.maxInterestRate }}%</span></div>
            <div class="maturity">가입기간 : {{ cluster.maturity }}개월</div>
          </div>
        </div>
      </div>

      <div v-else-if="itemRecommendations.length > 0">
        <h2> <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" style="color: #B197FC;" /> 고객님의 과거 상품과 유사한 상품을 추천해드려요</h2>
        <div class = "banner-container">
          <div class="card" v-for="item in itemRecommendations" :key="item.idPk"
          @click="goToProductDetail(item.idPk)">
            <div class="card-title"> {{ item.productName }} </div>
            <div class="interest-rate">최대금리 : <span class="highlight_card">{{ item.maxInterestRate }}%</span></div>
            <div class="maturity">가입기간 : {{ item.maturity }}개월</div>
          </div>
        </div>
      </div>

      <div v-else-if="staticRecommendations.length > 0">
        <h1>고객님과 같은 생애주기를 지나고 있는 다른 고객님들이 많이 찾은 상품이에요</h1>
        <div class = "banner-container">
          <div class="banner" v-for="statics in staticRecommendations" :key="statics.idPk"
          @click="goToProductDetail(statics.idPk)">
            <div class="reco-product-name"> {{ statics.productName }} </div>
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
      const url = process.env.VUE_APP_API_URL + '/product/recommend'; // API의 URL을 여기에 입력하세요

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
        console.log(response.data);
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
.card {
  flex: 0 0 auto;
  margin-right: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  text-align: left;
  border-radius: 8px;
  overflow: hidden;
  flex-direction: column;
  align-items: center;
  position: relative;
  transition: transform 0.3s ease-in-out;
}

.card-title {
  width: 100%;
  /* 부모의 전체 너비 */
  border-radius: 20px 20px 0px 0px;
  background-color: #0262AC;
  color: white;
  /* 이미지보다 위에 오도록 설정 */
  padding: 12px 16px;
  margin: 0;
  font-size: 1.1em;
  font-weight: bold;
}

.card-content {
  width: 100%;
  border-radius: 0px 0px 20px 20px;
  background-color: white;
  padding: 0px 18px 0px 18px;
  z-index: 0;
}

/* 배너 스타일 */
.banner-container {
  display: flex;
  flex-direction:row;
  width: 100%;
  overflow-x: auto;
  background-color: #f0f8ff;
  border-radius: 10px;
  padding: 20px;
  margin: 20px 0;  
}

.card:hover {
  transform: translateY(-5px);
}

.interest-rate {
  background-color: #fafafa;
  padding: 8px 16px;
  margin: 0;
  font-size: 1.1em;
  font-weight: bold;
}

.maturity {
  background-color: #fafafa;
  padding: 10px 16px;
  margin: 0;
  font-size: 1em;
}

/* 전체 컨테이너 */
.container {
  max-width: 1200px;
  margin: auto;
}

/* 로딩 애니메이션 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5); /* 배경을 약간 어둡게 처리 */
}

.loading-overlay img {
  width: 120px; /* GIF 이미지 크기 조절 */
  height: auto;
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

.highlight_card {
  font-weight: bolder; /* 굵게 */
  font-size: larger; /* 크기 증가 */
  color: #ff0000;
}

.container h2{
  color: #292929;
  font-size: 1.5em;
  
}
</style>