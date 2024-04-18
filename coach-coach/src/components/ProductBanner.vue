<template>
  <div class="banner">
    <h2>{{ title }}</h2>
    <div v-for="(value, name) in recommendations" :key="name" class="banner-item">
      <span class="banner-name">{{ name }}</span>: <span class="banner-value">{{ value }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    recommendations: Object
  }
}
</script>
<style scoped>
.banner {
  background-color: #f4f4f4; /* 배경 색상 */
  border-radius: 10px; /* 모서리 둥글게 */
  padding: 20px; /* 내부 여백 */
  margin: 10px 0; /* 외부 여백 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
}

.banner-item {
  display: flex;
  align-items: center; /* 아이템을 세로 중앙으로 정렬 */
  justify-content: space-between; /* 아이템을 양 끝으로 정렬 */
  padding: 10px 0; /* 아이템 상하 여백 */
  border-bottom: 1px solid #eaeaea; /* 아래쪽 테두리 선 */
  margin-bottom: 10px; /* 아이템 간격 */
}

.banner-item:last-child {
  border-bottom: none; /* 마지막 아이템에는 테두리 선을 제거 */
}

.banner-name {
  font-weight: bold; /* 키 이름 두껍게 */
  color: #4f4f4f; /* 키 이름 색상 */
  flex-basis: 30%; /* 이름이 차지하는 비율 설정 */
}

.banner-value {
  color: #4caf50; /* 값 색상 */
  font-size: 1.2em; /* 값 글자 크기 */
  flex-basis: 70%; /* 값이 차지하는 비율 설정 */
}
</style>
