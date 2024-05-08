<template>
  <div class="main-view">
    <div class="main-slider">
      <!-- 슬라이드들 -->
      <div class="slides" :style="innerStyle">
        <div class="slide" v-for="(slide) in slides" :key="slide.id">
          <!-- 텍스트 영역 -->
          <div class="slide-text-content">
            <h2>{{ slide.title }}</h2>
            <div v-html="slide.description"></div>
          </div>
          <!-- 이미지 영역 -->
          <div class="slide-image-content">
            <img :src="slide.imageUrl" :alt="slide.altText">
          </div>
        </div>
      </div>
    </div>
    

    <!-- 서비스 아이콘 섹션 -->
    <div class="service-section">
      <div class="promotion-card1">
        <h2>✨주요 기능✨</h2>
      </div>
      <div class="service-card" v-for="service in services" :key="service.id">
        <div class="service-image-wrapper">
          <img :src="service.iconUrl" :alt="service.altText" class="service-image">
          <div class="overlay-banner">
            <h3>{{ service.title }}</h3>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 프로모션 섹션 -->
    <div class="promotion-section">
      <div class="promotion-card">
        <!-- <img :src="promotion.imageUrl" :alt="promotion.altText"> -->
        <div class="promotion-content">
          <p></p>
        </div>
      </div>
    </div> 
  </div>   
</template>


<script>
export default {
  name: 'BaseView',
  data() {
    return {
      slides: [
        { 
          id: 1, 
          imageUrl: require('@/assets/webee-removebg-preview.png'), // '@'는 src 디렉토리를 가리킵니다.
          altText: 'WIBEE-COACH를 소개합니다', 
          title: 'WIBEE-COACH를 소개합니다', 
          description:'<p>고객 대상 생애주기별 자산 목표를 달성할 수 있도록 관리해 주는 웹서비스 입니다.</p> <p>1️⃣ 나만의 목표 생성! 목표 달성률을 실시간으로 확인할 수 있어요.</p> <p>&ensp; &ensp; 목표를 달성할 수 있도록 자금을 모아보세요.</p> <p>2️⃣ 목표를 달성하실 수 있게 위비코치가 소비와 저축 측면 모두에서 관리해 드려요!</p> <p>3️⃣ 나에게 맞는 예적금 상품을 추천받을 수 있어요!</p>'
        },
        { 
          id: 2, 
          imageUrl: require('@/assets/webee-removebg-preview.png'),
          altText: '슬라이드 2', 
          title: '슬라이드 제목 2', 
          description: '설명 2' 
        }        
        ],
      services: [
        { id: 1, iconUrl: require('@/assets/chatbot.jpg'), title: '맞춤 뉴스 추천 및 목표 달성 어드바이저' },
        { id: 2, iconUrl: require('@/assets/recommendation2.jpg'), title: '적금 상품 추천 서비스' },
        { id: 3, iconUrl: require('@/assets/prediction.jpg'), title: '소비 예측 서비스' }
      ],      
      currentSlideIndex: 0,
    };
  },
  computed: {
      innerStyle() {
      return {
        transform: `translateX(-${this.currentSlideIndex * 100}%)`,
        display: 'flex',
      };  
    }
  }
};
</script>

<style>

/* 폰트 */
@font-face {
  font-family: 'dohyeon';
  src: url('../../fonts/BMDOHYEON_ttf.ttf');
}
@font-face {
  font-family: 'gmarketSans';
  src: url('../../fonts/GmarketSansTTFMedium.ttf');
}

/* 전체 페이지에 대한 기본 스타일 */
body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: 'gmarketSans';
}

.main-view {
    margin: 0;
    background-color: #EAF5FD;
}

/* 메인 슬라이더 섹션의 스타일 */
.main-slider {
  margin-bottom: 25px;
  position: relative;
  width: 100%;
  height: 400px; /* 높이는 디자인에 맞게 조절 */
  position: relative;
  overflow: hidden; /* 이미지가 슬라이더 밖으로 넘치지 않도록 */
}

.slide {
  display: flex;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
  transition: left 0.5s; /* 부드러운 슬라이드 효과 */
  left: 0;
}

.slides {
  width: 200%;
  transition: transform 0.5s ease;
  margin-left: 250px;
}

.inner {
  display: flex;
  transition: transform 0.5s ease;
}

.slide img {
  display: block;
  margin: 0;
  margin-top: 30px;
  max-width: 600px; /* 이미지 최대 너비 조정 */
  height: auto;
}

.slide-background {
  width: 100%;
  height: 300px; /* Adjust height as needed */
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-text-content {
  width: 50%;
  padding: 20px;
  box-sizing: border-box;
}

.slide-text-content h2 {
  font-size: 50px; /* 폰트 크기를 원하는 값으로 변경하세요. */
  color: #0067AC;
  font-family: 'dohyeon';
  
}

.slide-image-content {
  width: 50%;
  /* 이미지 스타일링 */
}

/* img {
  max-width : 350px;
  width: 350px;
  height: auto;
  display: block;
  object-fit: cover;
} */

.slider-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  background-color: transparent;
  border: none;
  font-size: 24px;
  z-index: 10;
}

/* 서비스 아이콘 섹션의 스타일 */
.service-section {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #0067AC;
  padding: 20px 0;
}

.service-section h2 {
  color:#fff;
  font-family: 'dohyeon';
}

.service-card {
  position: relative;
  /* display: flex; */
  flex-direction: column;
  align-items: center;
  width: 250px;
  height: 300px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background: #f5f5f5;
  text-align: center;
}

.service-image-wrapper {
  width: 100%;
  height: 100%;
  border-bottom: 2px solid #e0e0e0;
  background: #fff;
}

.service-image {
  width: 100%;
  border-radius: 10px 10px 0 0;
  object-fit: cover;
}

.service-description {
  /* 서비스 설명 텍스트 스타일 개선 */
  margin-top: 10px;
}

.service-description h3 {
  font-size: 14px;
  margin: 5px 0;
}

.service-description p {
  font-size: 12px;
  color: #888;
}

/* 프로모션 섹션의 스타일 */
.promotion-section {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #20C4F4; /* 배경색은 예시입니다 */
  padding: 20px 0;
}

.promotion-card {
  margin: 0 15px;
  text-align: center; /* 텍스트를 중앙에 배치 */
}

.promotion-card h2{
  font-family: 'dohyeon';
}

.highlight_card {
  font-weight: bolder; /* 굵게 */
  font-size: larger; /* 크기 증가 */
  color: #FEE101;
}

.overlay-banner {
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

</style>
