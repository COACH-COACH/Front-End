<template>
  <div>
    <h1>소비 관리 페이지입니다</h1>

    <h2>내 소비패턴 분석 ~ : {{ this.querySEQ }} </h2>
    
    <!-- 과거의 분기 별 소비 총액 -->
    <p align="middle"><iframe
      :src="generateDashboardUrl"
      height="437"
      width="40%"
      frameborder="0"
      allowfullscreen
    ></iframe></p>
    
    <h2>나와 같은 생애주기를 가진 고객님들의 특징이에요 : {{ this.queryLifeStage }} </h2>

    <!-- 체크 vs 신용 -->
    <p align="middle"><iframe
      :src="generateDashboardCard"
      height="391"
      frameborder="0"
      allowfullscreen
    ></iframe></p>

    <h2>다음 분기 나의 소비는 이럴 것 같아요!</h2>

    <div v-if="loading">
      <p align="middle">로딩 중...</p>
    </div>
    <div v-else>
      <div v-if="adminResponse">
        <p align="middle">예상 소비량은? : {{ adminResponse }}</p>
      </div>
    </div>

    <br>

  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['getToken']), // Vuex의 getToken getter를 컴포넌트 내에서 사용 가능하게 등록
    // 동적으로 대시보드 URL을 생성하는 계산된 속성
    generateDashboardUrl() {
      return `http://52.78.112.2:5601/app/dashboards#/view/d1b6bde0-0051-11ef-9a2c-13b8fdce0975?embed=true&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-15m,to:now))&_a=(description:'',filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:bc9f2190-fdfe-11ee-bcd1-05d191e26260,key:SEQ,negate:!f,params:(query:'${this.querySEQ}'),type:phrase),query:(match_phrase:(SEQ:'${this.querySEQ}')))),fullScreenMode:!f,options:(hidePanelTitles:!f,syncColors:!f,useMargins:!t),panels:!((embeddableConfig:(attributes:(references:!((id:bc9f2190-fdfe-11ee-bcd1-05d191e26260,name:indexpattern-datasource-current-indexpattern,type:index-pattern),(id:bc9f2190-fdfe-11ee-bcd1-05d191e26260,name:indexpattern-datasource-layer-7f82e03a-dabb-4b9a-b047-dbc4c9e580ce,type:index-pattern)),state:(datasourceStates:(indexpattern:(layers:('7f82e03a-dabb-4b9a-b047-dbc4c9e580ce':(columnOrder:!('07af7b70-2807-4ae3-a352-3c504255f4cc','4c9db103-3c95-4b5c-b737-139d34d862b3'),columns:('07af7b70-2807-4ae3-a352-3c504255f4cc':(dataType:string,isBucketed:!t,label:'Top%20values%20of%20BAS_YH',operationType:terms,params:(missingBucket:!f,orderBy:(fallback:!f,type:alphabetical),orderDirection:asc,otherBucket:!f,size:8),scale:ordinal,sourceField:BAS_YH),'4c9db103-3c95-4b5c-b737-139d34d862b3':(dataType:number,isBucketed:!f,label:'Median%20of%20TOT_USE_AM',operationType:median,scale:ratio,sourceField:TOT_USE_AM)),incompleteColumns:())))),filters:!(),query:(language:kuery,query:''),visualization:(axisTitlesVisibilitySettings:(x:!t,yLeft:!t,yRight:!t),curveType:LINEAR,fittingFunction:None,gridlinesVisibilitySettings:(x:!t,yLeft:!t,yRight:!t),labelsOrientation:(x:0,yLeft:0,yRight:0),layers:!((accessors:!('4c9db103-3c95-4b5c-b737-139d34d862b3'),layerId:'7f82e03a-dabb-4b9a-b047-dbc4c9e580ce',layerType:data,seriesType:line,xAccessor:'07af7b70-2807-4ae3-a352-3c504255f4cc')),legend:(isInside:!f,isVisible:!t,position:right,showSingleSeries:!f),preferredSeriesType:line,tickLabelsVisibilitySettings:(x:!t,yLeft:!t,yRight:!t),valueLabels:hide,xTitle:%EB%B6%84%EA%B8%B0,yLeftExtent:(mode:full),yRightExtent:(mode:full),yTitle:'%EC%B4%9D%20%EC%9D%B4%EC%9A%A9%EA%B8%88%EC%95%A1')),title:'',type:lens,visualizationType:lnsXY),enhancements:(),hidePanelTitles:!f),gridData:(h:15,i:b5bc4bf8-1061-4b60-980e-7676fe34cd91,w:24,x:0,y:0),panelIndex:b5bc4bf8-1061-4b60-980e-7676fe34cd91,title:'%EB%B6%84%EA%B8%B0%20%EB%B3%84%20%EC%9D%B4%EC%9A%A9%EA%B8%88%EC%95%A1',type:lens,version:'7.17.16')),query:(language:kuery,query:''),tags:!(),timeRestore:!f,title:'consum_filter%20by%20SEQ',viewMode:view)&hide-filter-bar=true`;
    },
    generateDashboardCard() {
      return `http://52.78.112.2:5601/app/dashboards#/view/e933f340-0059-11ef-9a2c-13b8fdce0975?embed=true&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-15m,to:now))&_a=(description:'',filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:bc9f2190-fdfe-11ee-bcd1-05d191e26260,key:LIFE_STAGE,negate:!f,params:(query:${this.queryLifeStage}),type:phrase),query:(match_phrase:(LIFE_STAGE:${this.queryLifeStage})))),fullScreenMode:!f,options:(hidePanelTitles:!f,syncColors:!f,useMargins:!t),panels:!((embeddableConfig:(attributes:(references:!((id:bc9f2190-fdfe-11ee-bcd1-05d191e26260,name:indexpattern-datasource-current-indexpattern,type:index-pattern),(id:bc9f2190-fdfe-11ee-bcd1-05d191e26260,name:indexpattern-datasource-layer-3a8df1e5-17a5-43c4-8c56-c211f63752a6,type:index-pattern)),state:(datasourceStates:(indexpattern:(layers:('3a8df1e5-17a5-43c4-8c56-c211f63752a6':(columnOrder:!(ab1da9a6-b6ae-449c-8a1d-81da12d1fe26,d20992fd-e464-433d-84c1-bec79e63bbf5,d20992fd-e464-433d-84c1-bec79e63bbf5X0,d20992fd-e464-433d-84c1-bec79e63bbf5X1,d20992fd-e464-433d-84c1-bec79e63bbf5X2),columns:(ab1da9a6-b6ae-449c-8a1d-81da12d1fe26:(dataType:string,isBucketed:!t,label:Filters,operationType:filters,params:(filters:!((input:(language:kuery,query:'CNF_USE_AM%20%3E%200'),label:'%EC%B2%B4%ED%81%AC%EC%B9%B4%EB%93%9C%20%EC%9D%B4%EC%9A%A9%EA%B8%88%EC%95%A1'),(input:(language:kuery,query:'CRDSL_USE_AM%20%3E0'),label:'%EC%8B%A0%EC%9A%A9%EC%B9%B4%EB%93%9C%20%EC%9D%B4%EC%9A%A9%EA%B8%88%EC%95%A1'))),scale:ordinal),d20992fd-e464-433d-84c1-bec79e63bbf5:(dataType:number,isBucketed:!f,label:'sum(CNF_USE_AM)%20%2B%20sum(CRDSL_USE_AM)',operationType:formula,params:(formula:'sum(CNF_USE_AM)%20%2B%20sum(CRDSL_USE_AM)',isFormulaBroken:!f),references:!(d20992fd-e464-433d-84c1-bec79e63bbf5X2),scale:ratio),d20992fd-e464-433d-84c1-bec79e63bbf5X0:(customLabel:!t,dataType:number,isBucketed:!f,label:'Part%20of%20sum(CNF_USE_AM)%20%2B%20sum(CRDSL_USE_AM)',operationType:sum,scale:ratio,sourceField:CNF_USE_AM),d20992fd-e464-433d-84c1-bec79e63bbf5X1:(customLabel:!t,dataType:number,isBucketed:!f,label:'Part%20of%20sum(CNF_USE_AM)%20%2B%20sum(CRDSL_USE_AM)',operationType:sum,scale:ratio,sourceField:CRDSL_USE_AM),d20992fd-e464-433d-84c1-bec79e63bbf5X2:(customLabel:!t,dataType:number,isBucketed:!f,label:'Part%20of%20sum(CNF_USE_AM)%20%2B%20sum(CRDSL_USE_AM)',operationType:math,params:(tinymathAst:(args:!(d20992fd-e464-433d-84c1-bec79e63bbf5X0,d20992fd-e464-433d-84c1-bec79e63bbf5X1),location:(max:35,min:0),name:add,text:'sum(CNF_USE_AM)%20%2B%20sum(CRDSL_USE_AM)',type:function)),references:!(d20992fd-e464-433d-84c1-bec79e63bbf5X0,d20992fd-e464-433d-84c1-bec79e63bbf5X1),scale:ratio)),incompleteColumns:())))),filters:!(),query:(language:kuery,query:''),visualization:(layers:!((categoryDisplay:default,groups:!(ab1da9a6-b6ae-449c-8a1d-81da12d1fe26),layerId:'3a8df1e5-17a5-43c4-8c56-c211f63752a6',layerType:data,legendDisplay:default,metric:d20992fd-e464-433d-84c1-bec79e63bbf5,nestedLegend:!f,numberDisplay:percent)),palette:(name:default,type:palette),shape:pie)),title:'',type:lens,visualizationType:lnsPie),enhancements:(),hidePanelTitles:!f),gridData:(h:13,i:'8d733ccd-e095-43a7-a6c5-ae80c75cbcd7',w:9,x:0,y:0),panelIndex:'8d733ccd-e095-43a7-a6c5-ae80c75cbcd7',title:'%EC%B9%B4%EB%93%9C%20%EC%9D%B4%EC%9A%A9%20%EB%B9%84%EC%9C%A8',type:lens,version:'7.17.16')),query:(language:kuery,query:''),tags:!(),timeRestore:!f,title:test2,viewMode:view)&hide-filter-bar=true`;
    }
 
  },
  data() {
    return {
      loading: false, // 로딩 상태를 추적하는 데이터
      adminResponse: null,
      // 아래는 ELK 그래프 그리기에 필요한 변수
      querySEQ: null, 
      queryLifeStage: null,
    };
  },
  mounted() {
    this.accessAdminPage(); // 페이지 로드 시 머신러닝 예측 자동 실행
    this.fetchELKDataUsingToken();
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
    async accessAdminPage() {
      this.loading = true; // 로딩 상태 시작

      const url = 'http://localhost:8080/user/invoke-flask';

      try {
        const token = this.getToken; // Vuex 스토어에서 토큰 가져오기 // 새로고침하면 vuex 스토어에 문제 있나/.???

        if (!token) {
          console.error('토큰이 없습니다. 로그인 후 다시 시도해주세요.');
          return;
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `${token}`, // HTTP request 헤더에 토큰 포함
          }
        });

        this.adminResponse = response.data;
      } catch (error) {
        console.error('소비량 예측 실패:', error);
      } finally {
        this.loading = false; // 로딩 상태 종료
      }
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 화면 전체 높이를 기준으로 가운데 정렬 */
}

h1, h2 {
  text-align: center; /* 텍스트를 가운데 정렬 */
}
.iframe-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px; /* 필요에 따라 마진 추가 */
}

.centered-iframe {
  width: 100%; /* iframe 너비 100%로 설정 */
  max-width: 800px; /* 최대 너비 설정 */
}

</style>

