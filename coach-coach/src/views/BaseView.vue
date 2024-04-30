<template>
  <div class="main-view">
    <div class="main-slider">
      <!-- 슬라이더 컨트롤 버튼 (이전) -->
      <button class="slider-control left" @click="prevSlide">&lt;</button>

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

      <button class="slider-control right" @click="nextSlide">&gt;</button>
    </div>

    <!-- 서비스 아이콘 섹션 -->
    <div class="service-section">
      <div class="service-card" v-for="service in services" :key="service.id" @click="openModal(service.id)">
        <img :src="service.iconUrl" :alt="service.altText">
        <div class="service-description">
          <h3>{{ service.title }}</h3>
          <p>{{ service.description }}</p>
        </div>
      </div>
    </div>
    
    <!-- 프로모션 섹션 -->
    <div class="promotion-section">
      <div class="promotion-card" v-for="promotion in promotions" :key="promotion.id">
        <img :src="promotion.imageUrl" :alt="promotion.altText">
        <div class="promotion-content">
          <h4>{{ promotion.title }}</h4>
          <p>{{ promotion.description }}</p>
        </div>
      </div>
      <!-- 모달 섹션 -->
      <div class="modal" v-if="showModal">
        <!-- 모달 내용 -->
        <button @click="closeModal">Close</button>
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
          altText: 'WiBee-Coach를 소개합니다', 
          title: 'WiBee-Coach를 소개합니다', 
          description:'<p>고객 대상 생애주기별 자산 목표를 달성할 수 있도록 관리해 주는 웹서비스 입니다.</p> <p>1️⃣ 나만의 목표 생성! 목표 달성률을 실시간으로 확인할 수 있어요. 목표를 달성할 수 있도록 자금을 모아보세요.</p> <p>2️⃣ 목표를 달성하실 수 있게 위비코치가 소비와 저축 측면 모두에서 관리해 드려요!</p> <p>3️⃣ 나에게 맞는 예적금 상품을 추천받을 수 있어요!</p>'
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
        { id: 1, iconUrl: 'path/to/icon1.png', title: '서비스 1', description: '설명 1' },
        { id: 2, iconUrl: 'path/to/icon2.png', title: '서비스 2', description: '설명 2' },
        { id: 3, iconUrl: 'path/to/icon3.png', title: '서비스 3', description: '설명 3' }
      ],      
      currentSlideIndex: 0,
      showModal: false
    };
  },
  computed: {
      innerStyle() {
      return {
        transform: `translateX(-${this.currentSlideIndex * 100}%)`,
        display: 'flex',
      };  
    }
  },
  methods: {
    nextSlide() {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
    },
    prevSlide() {
      this.currentSlideIndex = (this.currentSlideIndex + this.slides.length - 1) % this.slides.length;
    },

    openModal(id) {
      // 여기에 모달을 열 때 필요한 로직을 구현합니다.
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    }
  }
};
</script>

<style>
/* 전체 페이지에 대한 기본 스타일 */
body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: 'Arial', sans-serif;
}

/* 메인 슬라이더 섹션의 스타일 */
.main-slider {
  margin-top: 50px;
  margin-bottom: 25px;
  position: relative;
  width: 100%;
  height: 400px; /* 높이는 디자인에 맞게 조절 */
  background-color: rgb(255,255,255); /* 배경색은 예시입니다 */
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
  color: #FEE101;
  
}
.slide-image-content {
  width: 50%;
  /* 이미지 스타일링 */
}

img {
  max-width : 350px;
  width: 350px;
  height: auto;
  display: block;
  object-fit: cover;
}

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
  justify-content: center;
  align-items: center;
  background-color: #0067AC;
  padding: 20px 0;
}

.service-card {
  width: 150px; /* 카드의 너비 조정 */
  margin: 0 10px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2); /* 카드에 그림자 효과 추가 */
  background-color: #fff; /* 카드 배경색 변경 */
}

.service-description {
  /* 서비스 설명 텍스트 스타일 개선 */
  margin-top: 10px;
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

</style>
