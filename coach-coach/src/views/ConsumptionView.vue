<template>
  <div class="container">
    <div class="title">
      <h1>소비 관리</h1>
    </div>
    <div class="tabs">
      <button :aria-label="'Select ' + tab.title + ' tab'" v-for="tab in tabs" :key="tab.name" @click="selectTab(tab)" :class="{ 'active-tab': tab.name === activeTab }">{{ tab.title }}</button>
    </div>
    
    <div class="content red-container">
        <div v-show="activeTab === 'tab1'" class="active">
          <h2>😎나의 지난 지출을 확인해 보세요!</h2>
          <ConsumptionDashboardPersonal/>
          <consumptionStatics/>
          <ConsumtpionPredict/>
        </div>
    </div>

    <div class="content red-container">
        <div v-show="activeTab === 'tab2'" class="active">
          <h2>나와 같은 생애주기를 가진 고객님들의 특징이에요!</h2>
          <ConsumptionDashboardLifeStage/>
        </div>
    </div>
  </div>
</template>

<script>
import ConsumptionDashboardPersonal from '@/components/ConsumptionDashboardPersonal.vue';
import consumptionStatics from '@/components/ConsumptionStatics.vue';
import ConsumtpionPredict from '@/components/ConsumptionPredict.vue';
import ConsumptionDashboardLifeStage from '@/components/ConsumptionDashboardLifeStage.vue';


export default {
  components: {
    ConsumptionDashboardPersonal,
    consumptionStatics,
    ConsumtpionPredict,
    ConsumptionDashboardLifeStage
  },

  data() {
    return {
        activeTab: 'tab1',
        tabs: [
            { name: 'tab1', title: '나의 소비' },
            { name: 'tab2', title: '소비 비교' }
        ]
    }
  },
  
  methods: {
    selectTab(tab) {
        this.activeTab = tab.name;
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: auto;
  margin-top: 10px;
  padding: 20px;
  background-color: #fff; /* Clean white background */
}

.title {
  width: 100%; /* 현재 너비를 100%로 설정 */
  text-align: left; /* 텍스트를 왼쪽으로 정렬합니다. */
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  width: 100%;
}

.tabs button {
  flex: 1;  
  background-color: #20C4F4; /* 메인 색상 변경 */
  color: white;
  border: none;
  padding: 10px 20px;
  margin-right: 5px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.tabs button:hover .tabs button:focus{
  transform: translateY(-2px);
  background-color: #0067AC; /* 호버 시 색상 */
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.tabs button.active-tab {
  font-weight: bold;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  background-color: #0067AC; /* 활성 탭 색상 */
}

.content {
  width: 100%;
  margin-top: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  /* padding: 20px; */
  background-color: #ffffff; /* Light grey background for the content area */
}

.content h2{
  margin-left: 20px;
}

.iframe-container {
  margin-bottom: 20px;
}

.iframe-container iframe {
  width: 100%;
  height: 500px;
  border-radius: 5px;
}

.spend-yellow-container{
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.half-width {
  flex: 1;
  padding: 10px;
}

.max-spend, .comparison, .next-spending-prediction {
  background-color: #f1f1f1; /* White background for cards */
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Subtle shadow for elevation */
  margin-bottom: 10px; /* Spacing between cards */
  color: #0056b3;
}

.spend-category-card, .category-card {
  height: 250px;
  padding: 20px;
  border-radius: 5px;
  margin-bottom: 10px; /* Spacing between cards */
  text-align: center; /* Center text for better readability */
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}
.predict-category-card{
  padding: 20px;
  text-align: center; /* Center text for better readability */
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  margin-left: 20px;
  margin-right: 20px;
}
.spend-category-card h3{
  font-size: 20px;
  font-weight: bold;
  font-family: 'Open Sans';
}

.compare-category-card{
  background-color: #ffffff; /* 카드 배경색 */
  border-radius: 8px;
  flex:1;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  height: 190px;
  padding: 20px;
  background-color: #FFFFFF;
  transition: transform 0.3s;
}

.category-card:hover,  .compare-category-card:hover, .spend-category-card:hover, .predict-category-card:hover{
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15)
}

.category-cards-container {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.predict-card-container{
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.category-card {
  flex: 1;
  height: 200px;
  margin: 5px; /* Small margin between cards */
  padding: 10px; /* Padding inside each card */
  background-color: #ecf0f1; /* Light gray background for category cards */
  border-radius: 5px; /* Rounded corners for aesthetic */
  box-shadow: 0 1px 3px rgba(0,0,0,0.1); /* Light shadow for depth */
}

.category-card > div {
  flex: 1;
  padding: 10px;
  margin: 5px;
  background-color: #ecf0f1; /* Very light gray for card sections */
  border-radius: 5px; /* Rounded corners for internal cards */
  text-align: center; /* Centering text in category cards */
}

select {
  padding: 8px;
  border-radius: 5px;
  width: 100%;
  border: 1px solid #0056b3; /* Light grey border for dropdown */
  background-color: #e3e3e3; /* Matching background with category cards */
  margin-top: 10px;
  margin-bottom: 10px
}

p {
  font-size: 16px;
  color: #2c3e50; /* Dark blue-grey color for text */
}

.highlight {
  font-weight: bolder; /* 굵게 */
  font-size: larger; /* 크기 증가 */
  color: #0083CA;
}

.loader {
  border: 5px solid #f3f3f3; /* Light grey */
  border-top: 5px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

</style>
