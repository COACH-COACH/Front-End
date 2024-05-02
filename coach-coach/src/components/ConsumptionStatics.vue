<template>
    <div class="spend-yellow-container">
        <div class="blue-container1 half-width">
            <h3>내가 가장 많이 소비한 항목을 확인해 보세요!</h3>
            <div class="spend-category-card" v-if="this.spendCategory">
                <p v-if="displayMessage">{{ displayMessage }}</p>
                <h3 v-else>지난 기간 동안 <span class="highlight">{{ categoryName }}</span> 항목에 가장 많은 소비를 하셨습니다! 총 <span class="highlight">{{ categoryAmt }}원</span> 지출하셨어요. </h3>
            </div>     
        </div>

        <div class="blue-container2 half-width"> 
            <h3>지난 분기 대비 어떤 곳에 지출이 늘었고 줄었는지 확인해 보세요!</h3>
            <select v-model="selectedQuarter" @change="fetchQuarterData">
                <option v-for="option in quarters" :value="option.value">{{ option.text }}</option>
            </select>
            <div class="category-cards-container">
                <div class="compare-category-card">
                    <p>소비가 늘은 항목</p>
                    <div v-if="increaseList && increaseList.length > 0">
                        <ul>
                            <li v-for="item in increaseList" :key="item">{{ item }}</li>
                        </ul>
                    </div>
                    <div v-else>
                        <p>{{ quarterChangeMessage }}</p>
                    </div>
                </div>
                <div class="compare-category-card">
                    <p>소비가 줄은 항목</p>
                    <div v-if="decreaseList && decreaseList.length > 0">
                        <ul>
                            <li v-for="item in decreaseList" :key="item">{{ item }}</li>
                        </ul>
                    </div>
                    <div v-else>
                        <p>{{ quarterChangeMessage }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['getToken']), // Vuex의 getToken getter를 컴포넌트 내에서 사용 가능하게 등록
    // 동적으로 대시보드 URL을 생성하는 계산된 속성
  },
  data() {
    return {
        // 통계량 산출을 위한 변수
        spendCategory: '',
        categoryName: '',
        categoryAmt: 0,
        displayMessage: '',
        maxSpendingData: null,
        increaseList: [],
        decreaseList: [],
        quarterComparison: null,
        quarterChangeMessage: '',
        categoryMap: {
            FUNITR_AM: "가구",
            APPLNC_AM: "가전제품",
            HLTHFS_AM: "건강 식품",
            BLDMNG_AM: "건물 및 시설관리",
            ARCHIT_AM: "건축/자재",
            OPTIC_AM: "광학제품",
            AGRICTR_AM: "농업",
            LEISURE_S_AM: "레져업소",
            LEISURE_P_AM: "레져용품",
            CULTURE_AM: "문화/취미",
            SANIT_AM: "보건/위생",
            INSU_AM: "보험",
            OFFCOM_AM: "사무/통신기기",
            BOOK_AM: "서적/문구",
            RPR_AM: "수리서비스",
            HOTEL_AM: "숙박업",
            GOODS_AM: "신변잡화",
            TRVL_AM: "여행업",
            FUEL_AM: "연료판매",
            SVC_AM: "용역서비스",
            DISTBNP_AM: "유통업비영리",
            DISTBP_AM: "유통업영리",
            GROCERY_AM: "음식료품",
            HOS_AM: "의료기관",
            CLOTH_AM: "의류",
            RESTRNT_AM: "일반/휴게음식",
            AUTOMNT_AM: "자동차정비/유지",
            AUTOSL_AM: "자동차판매",
            KITWR_AM: "주방용품",
            FABRIC_AM: "직물",
            ACDM_AM: "학원",
            MBRSHOP_AM: "회원제형태업소"        
       },
      selectedQuarter: '2022q1',
      quarters: [
        { text: '2022년 1분기', value: '2022q1' },
        { text: '2022년 2분기', value: '2022q2' },
        { text: '2022년 3분기', value: '2022q3' },
        { text: '2022년 4분기', value: '2022q4' },
        { text: '2023년 1분기', value: '2023q1' },
        { text: '2023년 2분기', value: '2023q2' },
        { text: '2023년 3분기', value: '2023q3' },
        { text: '2023년 4분기', value: '2023q4' }        
      ]       
    }
  },

  mounted() {
    this.fetchELKDataUsingToken();
    this.fetchMaxSpendingData();
  },

  methods: {
    async fetchELKDataUsingToken() {
      const url = 'http://localhost:8080/user/data';
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

    async fetchMaxSpendingData() {
      this.loading = true;
      const url = `${process.env.VUE_APP_API_URL}/consumption/max`;
      try {
        const token = this.getToken;
        if (!token) {
          console.error('토큰이 없습니다. 로그인 후 다시 시도해주세요.');
          return;
        }
        const response = await axios.get(url, {
          headers: { Authorization: `${token}` }
        });

        console.log("spendCategory Response", response.data.data);
        this.spendCategory = response.data.data;
        console.log("최대 소비 통계량 산출을 위한 response", this.spendCategory);

        if (!this.spendCategory) {
          this.displayMessage = "데이터가 없습니다";
        } else {
          const { amt, category } = this.spendCategory;
          this.categoryName = this.categoryMap[category] || "분류되지 않은 카테고리";
          this.categoryAmt = amt * 1000;
          this.displayMessage = '';
        }
      } catch (error) {
        console.error('최대 지출 데이터 로드 실패:', error);
        this.displayMessage = "데이터 로드에 실패했습니다";
      } finally {
        this.loading = false;
      }
    },

    async fetchQuarterData() {
      if (!this.selectedQuarter) return;
      this.loading = true;
      const url = `${process.env.VUE_APP_API_URL}/consumption/compare?quarter=${this.selectedQuarter}`;

      try {
        const token = this.getToken;
        if (!token) {
          console.error('토큰이 없습니다. 로그인 후 다시 시도해주세요.');
          return;
        }
        const response = await axios.get(url, {
          headers: { Authorization: `${token}` }
        });
        
        console.log("fetchQuarterResponse response.data:", response.data.data);
        
        this.quarterComparison = response.data.data;
        console.log("fetchQuarterData:", this.quarterComparison);

        if (!response.data || !this.quarterComparison || Object.keys(this.quarterComparison).length === 0) {
            // 데이터가 없거나, 데이터 구조에 'increase'나 'decrease'가 없을 경우
            this.increaseList = [];
            this.decreaseList = [];
            this.quarterChangeMessage = "유의한 데이터 변동이 없습니다.";
            console.log(this.quarterChangeMessage);
        } else {
            // 데이터 구조에 'increase'와 'decrease'가 존재하는지 확인 후 처리
            this.handleData(this.quarterComparison);
        }
 
 
        // if (!this.quarterComparison || (Object.keys(this.quarterComparison.increase).length === 0 || Object.keys(response.data.decrease).length === 0)) {
        //   this.increaseList = []; // 변동사항이 없을 때 리스트 초기화
        //   this.decreaseList = [];      
        //   this.quarterChangeMessage = "유의한 데이터 변동이 없습니다";
        //   console.log(this.quarterChangeMessage);
        // } else {
        //   this.increaseList = this.processCategoryChanges(this.quarterComparison.increase, 'increase');
        //   this.decreaseList = this.processCategoryChanges(this.quarterComparison.decrease, 'decrease');
        //   this.quarterChangeMessage = "";
        // }

      } catch (error) {
        console.error('분기 비교 데이터 로드 실패:', error.response.data);
        this.quarterChangeMessage = error.response.data.error;
        // this.quarterChangeMessage = "데이터 로드에 실패했습니다";
      } finally {
        this.loading = false;
      }
    },

    handleData(data) {
            if (data.increase && Object.keys(data.increase).length > 0) {
                this.increaseList = this.processCategoryChanges(data.increase, 'increase');
            } else {
                this.increaseList = [];
                console.log("소비가 늘어난 항목이 없습니다.");
            }

            if (data.decrease && Object.keys(data.decrease).length > 0) {
                this.decreaseList = this.processCategoryChanges(data.decrease, 'decrease');
            } else {
                this.decreaseList = [];
                console.log("소비가 줄어든 항목이 없습니다.");
            }

            // 두 목록 모두 비어있는 경우
            if (this.increaseList.length === 0 && this.decreaseList.length === 0) {
                this.quarterChangeMessage = "유의한 데이터 변동이 없습니다.";
            } else {
                this.quarterChangeMessage = ""; // 목록에 데이터가 있는 경우, 메시지를 비웁니다.
            }
        },

    processCategoryChanges(changes, type) {
        return Object.entries(changes).map(([key, value]) => {
            let categoryName = this.categoryMap[key] || "분류되지 않은 카테고리";
            return `${categoryName}: ${type === 'increase' ? '+' : '-'} ${value * 1000}원`;
        });
    }

    // processCategoryChanges(changes, type) {
    //   let message = type === 'increase' ? '+' : '-';
    //   let result = Object.entries(changes).map(([key, value]) => {
    //     let categoryName = this.categoryMap[key] || "분류되지 않은 카테고리";
    //     return `${categoryName}: ${message} ${value * 1000}원`;
    //   });
    //   return result; 
    // }

  }
};
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