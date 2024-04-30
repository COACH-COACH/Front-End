<template>
  <div class="main-view">
    <div class="main-slider">
      <div class="slide" v-for="(slide, index) in slides" :key="slide.id" :style="{ left: `${index - currentSlideIndex}00%` }">
        <img :src="slide.imageUrl" :alt="slide.altText">
        <div class="slide-text">
          <h2>{{ slide.title }}</h2>
          <p>{{ slide.description }}</p>
        </div>
      </div>
      <!-- 페이저 버튼 -->
      <div class="pager">
        <button class="pager-btn" v-for="n in 2" :key="n" @click="currentSlideIndex = n-1">{{ n }}</button>
      </div>
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
        { id: 1, imageUrl: 'coach-coach/static/webee-removebg-preview.png', altText: '슬라이드 1', title: '슬라이드 제목 1', description: '설명 1' },
        { id: 2, imageUrl: 'coach-coach/static/webee-removebg-preview.png', altText: '슬라이드 2', title: '슬라이드 제목 2', description: '설명 2' }
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
  methods: {
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
  width: 100%;
  height: 300px; /* 높이는 디자인에 맞게 조절 */
  background-color: #ececec; /* 배경색은 예시입니다 */
  position: relative;
  overflow: hidden; /* 이미지가 슬라이더 밖으로 넘치지 않도록 */
}

.slide {
  width: 100%;
  height: 100%;
  position: absolute;
  transition: left 0.5s; /* 부드러운 슬라이드 효과 */
  left: 0;
}

.slide img {
  display: block;
  margin: 0 auto;
  max-width: 500px; /* 이미지 최대 너비 조정 */
  height: auto;
}

.slide-text {
  /* 텍스트를 이미지 아래 중앙에 배치 */
  position: absolute;
  top: 50%; /* 이미지 높이에 따라 조절이 필요할 수 있음 */
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff; /* 텍스트 색상 변경 */
  text-align: center;
}

/* 서비스 아이콘 섹션의 스타일 */
.service-section {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #004488;
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
  background-color: #d1e0e0; /* 배경색은 예시입니다 */
  padding: 20px 0;
}

.promotion-card {
  margin: 0 15px;
  text-align: center; /* 텍스트를 중앙에 배치 */
}

</style>
