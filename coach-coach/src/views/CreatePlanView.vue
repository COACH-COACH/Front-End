<template>
  <div class="all">
    <!-- 상단 -->
    <div class="background-color">
      <div class="description layout-margin">
        <!-- 좌측 타이틀 -->
        <div class="title">
          <h2 class="blue-text">두금님의 목표 실천 방법을<br />설정해 보세요🔥</h2>
          <p>두금님의 목표에 대해 계산해 보았어요</p>
          <img class="resize-image" :src="titleWibeeSrc" alt="캐릭터 이미지">
        </div>
        <!-- 우측 카드 -->
        <div class="card">
          <div class="card-title">
            <h3>나의 목표는?</h3>
            <h1>여행</h1>
          </div>
          <img :src="cardWibeeSrc" alt="캐릭터 이미지">
          <div class="card-content">
            <p class="blue-text"><b>현재 나는?</b></p>
            <ul>
              <li>목표 금액: 4,000,000원</li>
              <li>잔여 금액: 1,200,000원</li>
              <li>잔여 기간: 7개월</li>
            </ul>
            <p class="blue-text"><b>목표 금액까지</b></p>
            <ul>
              <li>매달 140,000원</li>
              <li>매주 18,000원</li>
              <li>매일 4,600원 모으면 달성할 수 있어요</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 하단 -->
    <div class="booking layout-margin">
      <h2 class="blue-text">어떤 저축 방식으로목표를 달성하시겠어요?📊</h2>
      <div class="form-grid">
        <div>
          <label for="start-date">저축 시작일을 선택해 주세요</label>
          <input type="date" id="start-date">
        </div>
        <div>
          <label for="method">저축 주기를 선택해 주세요</label>
          <select id="method">
            <option value="daily">매일</option>
            <option value="weekly">매주</option>
            <option value="monthly">매달</option>
          </select>
        </div>
        <div>
          <label for="saving-method">어떤 방식으로 저축하시겠어요?</label>
          <select id="saving-method" v-model="selectedMethod" @change="onChangeMethod">
            <option value="regular" selected>커피 줄이기☕</option>
            <option value="irregular">점심 아끼기🍱</option>
            <option value="lump-sum">배달 줄이기🏍</option>
            <option value="lump-sum">편의점 줄이기🍙</option>
            <option value="lump-sum">쇼핑 줄이기👕</option>
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
        <button class="create-btn">추가</button>
        <button class="cancel-btn">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'CreatePlanView',
  setup() {
    const titleWibeeSrc = ref(require('@/assets/wibee_hat.png'));
    const cardWibeeSrc = ref(require('@/assets/webee-removebg-preview.png'));
    return { titleWibeeSrc, cardWibeeSrc };
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