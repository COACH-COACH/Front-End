<template>
    <div class="predict-class">
        <h2>😎위비코치가 고객님의 다음 분기 소비를 예측해 봤어요!</h2>
        <div v-if="loading" class="loading-overlay">
          <img src="@/assets/loading.gif" alt="Loading..." />
           <!--  <span class="loader"><p align="middle">로딩 중...</p></span> -->
        </div>
        
        <div class="cards-container" v-else>
            <div class="predict-category-card">          
                <div v-if="adminResponse">
                    <p align="middle">다음 분기에 {{ numberFormat(formattedAdminResponse) }} 지출할 것으로 예상돼요!</p>
                </div>
                <div v-else>
                    <p>다음 분기 지출액을 예측할 수 없습니다.</p>
                </div>
            </div>

            <div class="predict-card-container">
                <div class="blue-container1 half-width">
                    <h3>나의 예상 지출 추이를 확인해 보세요!</h3>
                    <!-- 시계열 그래프 -->
                    <canvas ref="predictChart"></canvas>
                </div>
                <div class="blue-container2 half-width">
                    <div class="spend-category-card" v-if="formattedAdminResponse">
                        <div v-if="formattedAdminResponse < twentyPercentLess">
                            <h3>이대로 목표 달성까지 쭉쭉!</h3>
                            <p>직전분기보다 예상 지출액이<br/>20% 이상 감소할 것으로 예상돼요</p>
                        </div>
                        <div v-else-if="formattedAdminResponse > twentyPercentMore">
                            <h3>이대로라면 지출이 늘어날 거예요!</h3>
                            <p>직전분기보다 예상 지출액이<br/>20% 이상 증가할 것으로 예상돼요</p>
                        </div>
                        <div v-else>
                            <p>예상 지출액이 지난 분기와 비슷해요.</p>
                        </div>
                    </div>
                </div>    
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Chart from 'chart.js/auto';
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters(['getToken']), // Vuex의 getToken getter를 컴포넌트 내에서 사용 가능하게 등록

    // 동적으로 대시보드 URL을 생성하는 계산된 속성
    formattedAdminResponse(){
      return Math.round(this.adminResponse * 1000);
    }
  },

  data(){
    return {
      twentyPercentLess: 0,
      twentyPercentMore: 0,
      loading: false, // 로딩 상태를 추적하는 데이터
      adminResponse: null,
      
      // 시계열 그래프를 그리기 위한 변수
      lastActualValue: 0,
      chartData:{
        BAS_YH:[],
        TOT_USE_AM:[]
      },
      chart: null,
    }
  },
  mounted() {
    this.fetchELKDataUsingToken();
    this.accessAdminPage().then(()=>{
      this.fetchLastTotUseAm().then(()=> {
        this.$nextTick(() => {
          this.renderChart();
        });
      });
    });
  },

  methods: {
    async fetchELKDataUsingToken() {
      const url = process.env.VUE_APP_API_URL + '/user/data';
      const token = this.getToken;

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `${token}`,
          }
        });

        // 서버에서 받은 데이터를 변수에 설정
        this.querySEQ = response.data.seq;
        this.queryLifeStage = response.data.lifeStage;

      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
      }
    },

    async accessAdminPage() {
      this.loading = true; // 로딩 상태 시작

      const url = process.env.VUE_APP_API_URL + '/user/invoke-flask';

      try {
        const token = this.getToken; // Vuex 스토어에서 토큰 가져오기

        if (!token) {
          console.error('토큰이 없습니다. 로그인 후 다시 시도해주세요.');
          return;
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            "Authorization": `${token}`, // HTTP request 헤더에 토큰 포함
            "Content-Type": "application/json"
          }
        }).then((response) => response.json());

        if (response) {
          this.adminResponse = response.result;
        } else {
          console.error('데이터가 비어 있거나 접근할 수 없습니다.');
        }
      } catch (error) {
        console.error('소비량 예측 실패:', error);
      } finally {
        this.loading = false; // 로딩 상태 종료
      }
    },

    async fetchLastTotUseAm() {
      this.loading = true;
      const url = `${process.env.VUE_APP_API_URL}/consumption/comparePrediction`;
      try {
        const token = this.getToken;
        if (!token) {
          console.error('토큰이 없습니다. 로그인 후 다시 시도해주세요.');
          return;
        }
        const response = await axios.get(url, {
          headers: { Authorization: `${token}` }
        });

        if (response.data && response.data.data.BAS_YH && response.data.data.TOT_USE_AM){
        this.chartData.BAS_YH = response.data.data.BAS_YH;
        this.chartData.TOT_USE_AM = response.data.data.TOT_USE_AM;

        // 데이터 정렬 호출
        this.sortChartData();

        // 직전분기 실제값 변수 정의
        this.lastActualValue = this.chartData.TOT_USE_AM[this.chartData.TOT_USE_AM.length-1];

        this.twentyPercentLess = (this.lastActualValue *1000) * 0.8;
        this.twentyPercentMore = (this.lastActualValue*1000) * 1.2;      

        // 그래프를 그리기 위해 예측값과 실제값 통합
        this.chartData.BAS_YH.push('nextq');
        this.chartData.TOT_USE_AM.push(this.adminResponse);

        } else {
          console.error('데이터가 비어있거나 예상 형식과 다릅니다', response.data);
        }
      } catch (error) {
        console.error('데이터 로드에 실패했습니다', error);
      } finally {
        this.loading = false;
      }
    },

    numberFormat(value) {
      return new Intl.NumberFormat('ko-KR', {
        minimumFractionDigits: 0, // 소수점 아래 최소 자릿수
        maximumFractionDigits: 0  // 소수점 아래 최대 자릿수
      }).format(value) + '원';
    },

    sortChartData() {
      // 데이터와 라벨을 연결하기 위해 배열의 인덱스와 함께 객체 배열을 생성
      let combined = this.chartData.BAS_YH.map((e, i) => ({ label: e, value: this.chartData.TOT_USE_AM[i] }));

      // 라벨을 연도와 분기로 파싱하여 정렬
      combined.sort((a, b) => {
        let yearA = parseInt(a.label.slice(0, 4));
        let yearB = parseInt(b.label.slice(0, 4));

        // 분기 숫자 추출, 일치하는 것이 없다면 기본값으로 0을 사용
        let quarterA = a.label.match(/q(\d)/i) ? parseInt(a.label.match(/q(\d)/i)[1]) : 0;
        let quarterB = b.label.match(/q(\d)/i) ? parseInt(b.label.match(/q(\d)/i)[1]) : 0;

        if (yearA !== yearB) {
          return yearA - yearB;
        } else {
          return quarterA - quarterB;
        }
      });

      // 정렬된 데이터로부터 새로운 라벨과 데이터 배열 생성
      this.chartData.BAS_YH = combined.map(e => e.label);
      this.chartData.TOT_USE_AM = combined.map(e => e.value);
    },

    renderChart(){
      // const predictChartCanvas = this.predictChartCanvas;
      const predictChartCanvas = this.$refs.predictChart;
      if (!predictChartCanvas) {
        // console.log(this);
        console.error('Canvas element not found!');
        return;
      }

      const ctx = predictChartCanvas.getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.chartData.BAS_YH,
          datasets: [{
            label: '총 지출액 추이',
            data: this.chartData.TOT_USE_AM,
            fill: true,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: false
            }
          }
        }
      });
    }
  } 
};
</script>

<style>
.loading-container {
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

.predict-class h2 {
    padding: 10px;
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

.predict-card-container{
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.spend-category-card, .category-card {
  height: 300px;
  padding: 20px;
  border-radius: 5px;
  margin-bottom: 10px;
  margin-right : 10px;
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

.category-card:hover,  .compare-category-card:hover, .spend-category-card:hover, .predict-category-card:hover{
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15)
}

.spend-category-card h3{
  font-size: 20px;
  font-weight: bold;
  font-family: 'Open Sans';
}

.blue-container1 half-width h3{
    margin-left: 10px;
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

</style>