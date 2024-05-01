<template>
  <div class="container">
    <header class="app-header">
      <h1>소비 관리 페이지입니다</h1>
    </header>
    <div class="tabs">
      <button v-for="tab in tabs" :key="tab.name" @click="selectTab(tab)" :class="{ 'active-tab': tab.name === activeTab }">{{ tab.title }}</button>
    </div>
    
    <div class="content red-container"> <!-- Red Container 1 -->
      <div v-show="activeTab === 'tab1'" class="active">
        <h2>😎나의 지난 지출을 확인해 보세요!</h2>
        <div class="iframe-container">
          <iframe :src="generateDashboardUrl" class="centered-iframe" frameborder="0" allowfullscreen></iframe>
        </div>

        <div class="spend-yellow-container">
          <div class="blue-container1 half-width">
            <div class="spend-category-card" v-if="this.spendCategory">
              <p v-if="displayMessage">{{ displayMessage }}</p>
              <h3 v-else>지난 기간 동안 <span class="highlight">{{ categoryName }}</span> 항목에 가장 많은 소비를 하셨습니다! 총 <span class="highlight">{{ categoryAmt }}원</span> 지출하셨어요. </h3>
            </div>     
          </div>

          <div class="blue-container2 half-width"> 
            <select v-model="selectedQuarter" @change="fetchQuarterData">
              <option v-for="option in quarters" :value="option.value">{{ option.text }}</option>
            </select>
            <div class="category-cards-container">
              <div class="category-card">
                <div v-if="quarterComparison">
                  <p>지출 증가 카테고리: {{ quarterComparison.increase }}</p>
                </div>
              </div>
              <div class="category-card">
                <div v-if="quarterComparison">
                  <p>지출 감소 카테고리: {{ quarterComparison.decrease }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <h2>😎위비코치가 고객님의 다음 분기 소비를 예측해 봤어요!</h2>
        <div v-if="loading">
          <p align="middle">로딩 중...</p>
        </div>
        <div class="blue-container2 half-width" v-else>
          <div class="category-cards-container">
            <div class="category-card">          
              <div v-if="adminResponse">
                <p align="middle">예상 소비량은? : {{ adminResponse }}</p>
              </div>
            </div>
          </div> 
        </div>    
      </div>
    </div>
    
    <div class="content red-container">
      <div v-show="activeTab === 'tab2'" class="active">
        <h2>나와 같은 생애주기를 가진 고객님들의 특징이에요! : {{ this.queryLifeStage }} </h2>
        <!-- 체크 vs 신용 -->
        <div class="iframe-container">
          <iframe
            :src="generateDashboardCard"
            class="centered-iframe"
            frameborder="0"
            allowfullscreen
          ></iframe>       
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
    generateDashboardUrl() {
      return `http://52.78.112.2:5601/app/dashboards#/view/d1b6bde0-0051-11ef-9a2c-13b8fdce0975?embed=true&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-15m,to:now))&_a=(description:'',filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'844553f0-007e-11ef-9a2c-13b8fdce0975',key:SEQ,negate:!f,params:(query:'${this.querySEQ}'),type:phrase),query:(match_phrase:(SEQ:'${this.querySEQ}')))),fullScreenMode:!f,options:(hidePanelTitles:!f,syncColors:!f,useMargins:!t),panels:!((embeddableConfig:(enhancements:(),savedVis:(data:(aggs:!(),searchSource:(filter:!(),query:(language:kuery,query:''))),description:'',id:'',params:(controls:!((fieldName:BAS_YH,id:'1714394069233',indexPattern:'844553f0-007e-11ef-9a2c-13b8fdce0975',label:'%EB%B6%84%EA%B8%B0%EB%B3%84%20%EB%82%B4%20%EC%86%8C%EB%B9%84%20%ED%99%95%EC%9D%B8%ED%95%98%EA%B8%B0',options:(dynamicOptions:!t,multiselect:!f,order:desc,size:5,type:terms),parent:'',type:list)),pinFilters:!f,updateFiltersOnChange:!f,useTimeFilter:!f),title:'',type:input_control_vis,uiState:())),gridData:(h:6,i:e79a28cd-85ea-4739-aa55-35b328ed5d80,w:48,x:0,y:0),panelIndex:e79a28cd-85ea-4739-aa55-35b328ed5d80,type:visualization,version:'7.17.16'),(embeddableConfig:(attributes:(references:!((id:'844553f0-007e-11ef-9a2c-13b8fdce0975',name:indexpattern-datasource-current-indexpattern,type:index-pattern),(id:'844553f0-007e-11ef-9a2c-13b8fdce0975',name:indexpattern-datasource-layer-77aee5c4-362e-4a97-890a-93a2d54b41e5,type:index-pattern)),state:(datasourceStates:(indexpattern:(layers:('77aee5c4-362e-4a97-890a-93a2d54b41e5':(columnOrder:!('43ef65df-4710-4f52-a7e9-5a724386017f','7419f504-0d54-4238-84d9-025bde7838d8',ceb89fd3-175c-42ab-8f49-bde843189982,'2f25749c-8e17-4087-b6e6-964caac3c3f8','8448cfc8-4f77-4294-997b-bdc261ec67e9','16860516-67f9-44cd-9535-3af7d9b1bb3a','74400b59-d590-45e9-8b42-02138418f39a',e44ab016-7c0f-407b-be8f-d2af8588e86c,'3fff568f-28b1-438a-9c6f-1ddd9d5bfc16','6c730b0e-5e29-4d6b-9ae7-250b4549ef71','5f460347-54d4-4659-bc23-458b39b08bd7','96f63851-e344-4bae-860b-f5a9c6db6fc5',cf889362-1eab-4493-b25e-de2fd304c8be,'474f72a2-6a80-4a98-b657-66e8529044e7',c3991cb3-eb26-41c9-bf0c-a9cbba2c7978,ef31f31b-cae8-43bb-b26a-690f3a67d4b1,ffff7ebf-4488-4e71-9b67-b3a4b8ab8432,a1f4a9b8-9078-4c30-a611-c77641d1b7d6,'609bab6e-ead8-427b-ac19-2b6540f028b3','11210ec1-9ed0-4b28-ba8d-c1de2b24bc0a','6ed53036-f851-4491-94f3-cdfb477d333a','3ceccdc6-479c-4b73-b21d-955bcaf0cd16',a91eb0fb-4ac0-4554-8fe5-6ebfec73ba40,'6cf5a8a2-ec26-44b8-a47e-4ddbe9c1d526','52733339-d8e6-4cc2-bc58-67d28cc77437',d3fe31bd-81b4-4593-bf93-1d5cd0e8cdac,'3543f209-3ced-46da-a6e0-0dec01c952e3','3c9bff9a-333f-42c0-bdb4-1a12a98d73a6',b67393dc-19e8-40a3-8e39-b7d129a2d614,'09d7e8bc-3b89-4084-9efd-16e812644c94','90c13e04-c1c9-498c-bbd3-d106cdc3ac1c','51440fa6-80ba-4ea9-a60e-a9ba889d00c8','9ebf4feb-6850-4ac0-bcba-522f1f4edb04'),columns:('09d7e8bc-3b89-4084-9efd-16e812644c94':(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%A3%BC%EB%B0%A9%EC%9A%A9%ED%92%88,operationType:sum,scale:ratio,sourceField:KITWR_AM),'11210ec1-9ed0-4b28-ba8d-c1de2b24bc0a':(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%97%B0%EB%A3%8C%ED%8C%90%EB%A7%A4,operationType:sum,scale:ratio,sourceField:FUEL_AM),'16860516-67f9-44cd-9535-3af7d9b1bb3a':(customLabel:!t,dataType:number,isBucketed:!f,label:%EA%B1%B4%EC%B6%95%2F%EC%9E%90%EC%9E%AC,operationType:sum,scale:ratio,sourceField:ARCHIT_AM),'2f25749c-8e17-4087-b6e6-964caac3c3f8':(customLabel:!t,dataType:number,isBucketed:!f,label:%EA%B1%B4%EA%B0%95%EC%8B%9D%ED%92%88,operationType:sum,scale:ratio,sourceField:HLTHFS_AM),'3543f209-3ced-46da-a6e0-0dec01c952e3':(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%9D%BC%EB%B0%98%2F%ED%9C%B4%EA%B2%8C%EC%9D%8C%EC%8B%9D,operationType:sum,params:(),scale:ratio,sourceField:RESTRNT_AM),'3c9bff9a-333f-42c0-bdb4-1a12a98d73a6':(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%9E%90%EB%8F%99%EC%B0%A8%EC%A0%95%EB%B9%84%2F%EC%9C%A0%EC%A7%80,operationType:sum,scale:ratio,sourceField:AUTOMNT_AM),'3ceccdc6-479c-4b73-b21d-955bcaf0cd16':(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%9C%A0%ED%86%B5%EC%97%85%EB%B9%84%EC%98%81%EB%A6%AC,operationType:sum,scale:ratio,sourceField:DISTBNP_AM),'3fff568f-28b1-438a-9c6f-1ddd9d5bfc16':(customLabel:!t,dataType:number,isBucketed:!f,label:%EB%A0%88%EC%A0%B8%EC%97%85%EC%86%8C,operationType:sum,scale:ratio,sourceField:LEISURE_P_AM),'43ef65df-4710-4f52-a7e9-5a724386017f':(dataType:string,isBucketed:!t,label:Filters,operationType:filters,params:(filters:!((input:(language:kuery,query:''),label:''))),scale:ordinal),'474f72a2-6a80-4a98-b657-66e8529044e7':(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%82%AC%EB%AC%B4%2F%ED%86%B5%EC%8B%A0%EA%B8%B0%EA%B8%B0,operationType:sum,scale:ratio,sourceField:OFFCOM_AM),'51440fa6-80ba-4ea9-a60e-a9ba889d00c8':(customLabel:!t,dataType:number,isBucketed:!f,label:%ED%95%99%EC%9B%90,operationType:sum,scale:ratio,sourceField:ACDM_AM),'52733339-d8e6-4cc2-bc58-67d28cc77437':(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%9D%98%EB%A3%8C%EA%B8%B0%EA%B4%80,operationType:sum,scale:ratio,sourceField:HOS_AM),'5f460347-54d4-4659-bc23-458b39b08bd7':(customLabel:!t,dataType:number,isBucketed:!f,label:%EB%AC%B8%ED%99%94%2F%EC%B7%A8%EB%AF%B8,operationType:sum,scale:ratio,sourceField:CULTURE_AM),'609bab6e-ead8-427b-ac19-2b6540f028b3':(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%97%AC%ED%96%89%EC%97%85,operationType:sum,scale:ratio,sourceField:TRVL_AM),'6c730b0e-5e29-4d6b-9ae7-250b4549ef71':(customLabel:!t,dataType:number,isBucketed:!f,label:%EB%A0%88%EC%A0%B8%EC%9A%A9%ED%92%88,operationType:sum,scale:ratio,sourceField:LEISURE_S_AM),'6cf5a8a2-ec26-44b8-a47e-4ddbe9c1d526':(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%9D%8C%EC%8B%9D%EB%A3%8C%ED%92%88,operationType:sum,scale:ratio,sourceField:GROCERY_AM),'6ed53036-f851-4491-94f3-cdfb477d333a':(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%9A%A9%EC%97%AD%EC%84%9C%EB%B9%84%EC%8A%A4,operationType:sum,scale:ratio,sourceField:SVC_AM),'7419f504-0d54-4238-84d9-025bde7838d8':(customLabel:!t,dataType:number,isBucketed:!f,label:%EA%B0%80%EA%B5%AC,operationType:sum,scale:ratio,sourceField:FUNITR_AM),'74400b59-d590-45e9-8b42-02138418f39a':(customLabel:!t,dataType:number,isBucketed:!f,label:%EA%B4%91%ED%95%99%EC%A0%9C%ED%92%88,operationType:sum,scale:ratio,sourceField:OPTIC_AM),'8448cfc8-4f77-4294-997b-bdc261ec67e9':(customLabel:!t,dataType:number,isBucketed:!f,label:%EA%B1%B4%EB%AC%BC%EB%B0%8F%EC%8B%9C%EC%84%A4%EA%B4%80%EB%A6%AC,operationType:sum,scale:ratio,sourceField:BLDMNG_AM),'90c13e04-c1c9-498c-bbd3-d106cdc3ac1c':(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%A7%81%EB%AC%BC,operationType:sum,scale:ratio,sourceField:FABRIC_AM),'96f63851-e344-4bae-860b-f5a9c6db6fc5':(customLabel:!t,dataType:number,isBucketed:!f,label:%EB%B3%B4%EA%B1%B4%2F%EC%9C%84%EC%83%9D,operationType:sum,scale:ratio,sourceField:SANIT_AM),'9ebf4feb-6850-4ac0-bcba-522f1f4edb04':(customLabel:!t,dataType:number,isBucketed:!f,label:%ED%9A%8C%EC%9B%90%EC%A0%9C%ED%98%95%ED%83%9C%EC%97%85%EC%86%8C,operationType:sum,params:(),scale:ratio,sourceField:MBRSHOP_AM),a1f4a9b8-9078-4c30-a611-c77641d1b7d6:(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%8B%A0%EB%B3%80%EC%9E%A1%ED%99%94,operationType:sum,scale:ratio,sourceField:GOODS_AM),a91eb0fb-4ac0-4554-8fe5-6ebfec73ba40:(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%9C%A0%ED%86%B5%EC%97%85%EC%98%81%EB%A6%AC,operationType:sum,scale:ratio,sourceField:DISTBP_AM),b67393dc-19e8-40a3-8e39-b7d129a2d614:(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%9E%90%EB%8F%99%EC%B0%A8%ED%8C%90%EB%A7%A4,operationType:sum,scale:ratio,sourceField:AUTOSL_AM),c3991cb3-eb26-41c9-bf0c-a9cbba2c7978:(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%84%9C%EC%A0%81%2F%EB%AC%B8%EA%B5%AC,operationType:sum,scale:ratio,sourceField:BOOK_AM),ceb89fd3-175c-42ab-8f49-bde843189982:(customLabel:!t,dataType:number,isBucketed:!f,label:%EA%B0%80%EC%A0%84%EC%A0%9C%ED%92%88,operationType:sum,scale:ratio,sourceField:APPLNC_AM),cf889362-1eab-4493-b25e-de2fd304c8be:(customLabel:!t,dataType:number,isBucketed:!f,label:%EB%B3%B4%ED%97%98,operationType:sum,scale:ratio,sourceField:INSU_AM),d3fe31bd-81b4-4593-bf93-1d5cd0e8cdac:(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%9D%98%EB%A5%98,operationType:sum,scale:ratio,sourceField:CLOTH_AM),e44ab016-7c0f-407b-be8f-d2af8588e86c:(customLabel:!t,dataType:number,isBucketed:!f,label:%EB%86%8D%EC%97%85,operationType:sum,scale:ratio,sourceField:AGRICTR_AM),ef31f31b-cae8-43bb-b26a-690f3a67d4b1:(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%88%98%EB%A6%AC%EC%84%9C%EB%B9%84%EC%8A%A4,operationType:sum,scale:ratio,sourceField:RPR_AM),ffff7ebf-4488-4e71-9b67-b3a4b8ab8432:(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%88%99%EB%B0%95%EC%97%85,operationType:sum,scale:ratio,sourceField:HOTEL_AM)),incompleteColumns:())))),filters:!(),query:(language:kuery,query:''),visualization:(axisTitlesVisibilitySettings:(x:!t,yLeft:!t,yRight:!t),fittingFunction:None,gridlinesVisibilitySettings:(x:!t,yLeft:!t,yRight:!t),labelsOrientation:(x:-45,yLeft:0,yRight:0),layers:!((accessors:!('7419f504-0d54-4238-84d9-025bde7838d8',ceb89fd3-175c-42ab-8f49-bde843189982,'2f25749c-8e17-4087-b6e6-964caac3c3f8','8448cfc8-4f77-4294-997b-bdc261ec67e9','16860516-67f9-44cd-9535-3af7d9b1bb3a','74400b59-d590-45e9-8b42-02138418f39a',e44ab016-7c0f-407b-be8f-d2af8588e86c,'3fff568f-28b1-438a-9c6f-1ddd9d5bfc16','6c730b0e-5e29-4d6b-9ae7-250b4549ef71','5f460347-54d4-4659-bc23-458b39b08bd7','96f63851-e344-4bae-860b-f5a9c6db6fc5',cf889362-1eab-4493-b25e-de2fd304c8be,'474f72a2-6a80-4a98-b657-66e8529044e7',c3991cb3-eb26-41c9-bf0c-a9cbba2c7978,ef31f31b-cae8-43bb-b26a-690f3a67d4b1,ffff7ebf-4488-4e71-9b67-b3a4b8ab8432,a1f4a9b8-9078-4c30-a611-c77641d1b7d6,'609bab6e-ead8-427b-ac19-2b6540f028b3','11210ec1-9ed0-4b28-ba8d-c1de2b24bc0a','6ed53036-f851-4491-94f3-cdfb477d333a','3ceccdc6-479c-4b73-b21d-955bcaf0cd16',a91eb0fb-4ac0-4554-8fe5-6ebfec73ba40,'6cf5a8a2-ec26-44b8-a47e-4ddbe9c1d526','52733339-d8e6-4cc2-bc58-67d28cc77437',d3fe31bd-81b4-4593-bf93-1d5cd0e8cdac,'3543f209-3ced-46da-a6e0-0dec01c952e3','3c9bff9a-333f-42c0-bdb4-1a12a98d73a6',b67393dc-19e8-40a3-8e39-b7d129a2d614,'09d7e8bc-3b89-4084-9efd-16e812644c94','90c13e04-c1c9-498c-bbd3-d106cdc3ac1c','51440fa6-80ba-4ea9-a60e-a9ba889d00c8','9ebf4feb-6850-4ac0-bcba-522f1f4edb04'),layerId:'77aee5c4-362e-4a97-890a-93a2d54b41e5',layerType:data,seriesType:bar_horizontal,splitAccessor:'43ef65df-4710-4f52-a7e9-5a724386017f',yConfig:!((axisMode:auto,forAccessor:'3543f209-3ced-46da-a6e0-0dec01c952e3')))),legend:(isInside:!f,isVisible:!t,position:right,showSingleSeries:!t),preferredSeriesType:bar_horizontal,tickLabelsVisibilitySettings:(x:!t,yLeft:!t,yRight:!t),valueLabels:inside,valuesInLegend:!f,xTitle:'%EB%8F%88%EC%9D%84%20%EC%93%B4%20%EB%B6%84%EC%95%BC',yLeftExtent:(mode:full),yRightExtent:(mode:full),yTitle:%EC%95%A1%EC%88%98)),title:'',type:lens,visualizationType:lnsXY),enhancements:(),hidePanelTitles:!f),gridData:(h:16,i:'8276cdef-8c97-4f57-a99e-24715b89f5e6',w:24,x:0,y:6),panelIndex:'8276cdef-8c97-4f57-a99e-24715b89f5e6',title:'%EB%B6%84%EC%95%BC%20%EB%B3%84%20%EB%8F%88%EC%9D%84%20%EC%93%B4%20%EC%95%A1%EC%88%98',type:lens,version:'7.17.16'),(embeddableConfig:(attributes:(references:!((id:'844553f0-007e-11ef-9a2c-13b8fdce0975',name:indexpattern-datasource-current-indexpattern,type:index-pattern),(id:'844553f0-007e-11ef-9a2c-13b8fdce0975',name:indexpattern-datasource-layer-7f82e03a-dabb-4b9a-b047-dbc4c9e580ce,type:index-pattern)),state:(datasourceStates:(indexpattern:(layers:('7f82e03a-dabb-4b9a-b047-dbc4c9e580ce':(columnOrder:!('07af7b70-2807-4ae3-a352-3c504255f4cc','4c9db103-3c95-4b5c-b737-139d34d862b3'),columns:('07af7b70-2807-4ae3-a352-3c504255f4cc':(dataType:string,isBucketed:!t,label:'Top%20values%20of%20BAS_YH',operationType:terms,params:(missingBucket:!f,orderBy:(fallback:!f,type:alphabetical),orderDirection:asc,otherBucket:!f,size:8),scale:ordinal,sourceField:BAS_YH),'4c9db103-3c95-4b5c-b737-139d34d862b3':(dataType:number,isBucketed:!f,label:'Average%20of%20TOT_USE_AM',operationType:average,scale:ratio,sourceField:TOT_USE_AM)),incompleteColumns:())))),filters:!(),query:(language:kuery,query:''),visualization:(axisTitlesVisibilitySettings:(x:!t,yLeft:!t,yRight:!t),curveType:LINEAR,fittingFunction:None,gridlinesVisibilitySettings:(x:!t,yLeft:!t,yRight:!t),labelsOrientation:(x:0,yLeft:0,yRight:0),layers:!((accessors:!('4c9db103-3c95-4b5c-b737-139d34d862b3'),layerId:'7f82e03a-dabb-4b9a-b047-dbc4c9e580ce',layerType:data,seriesType:line,xAccessor:'07af7b70-2807-4ae3-a352-3c504255f4cc',yConfig:!((color:%23d36086,forAccessor:'4c9db103-3c95-4b5c-b737-139d34d862b3')))),legend:(isInside:!f,isVisible:!t,position:right,showSingleSeries:!f),preferredSeriesType:line,tickLabelsVisibilitySettings:(x:!t,yLeft:!t,yRight:!t),valueLabels:hide,xTitle:%EB%B6%84%EA%B8%B0,yLeftExtent:(mode:full),yRightExtent:(mode:full),yTitle:'%EC%B4%9D%20%EC%9D%B4%EC%9A%A9%EA%B8%88%EC%95%A1')),title:'',type:lens,visualizationType:lnsXY),enhancements:(),hidePanelTitles:!f),gridData:(h:16,i:b5bc4bf8-1061-4b60-980e-7676fe34cd91,w:24,x:24,y:6),panelIndex:b5bc4bf8-1061-4b60-980e-7676fe34cd91,title:'%EB%B6%84%EA%B8%B0%20%EB%B3%84%20%EC%9D%B4%EC%9A%A9%EA%B8%88%EC%95%A1',type:lens,version:'7.17.16')),query:(language:kuery,query:''),tags:!(),timeRestore:!f,title:'consum_filter%20by%20SEQ',viewMode:view)&hide-filter-bar=true`;
    },
    generateDashboardCard() {
      // return `http://52.78.112.2:5601/app/dashboards#/view/e933f340-0059-11ef-9a2c-13b8fdce0975?embed=true&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-15m,to:now))&_a=(description:'',filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:bc9f2190-fdfe-11ee-bcd1-05d191e26260,key:LIFE_STAGE,negate:!f,params:(query:${this.queryLifeStage}),type:phrase),query:(match_phrase:(LIFE_STAGE:${this.queryLifeStage})))),fullScreenMode:!f,options:(hidePanelTitles:!f,syncColors:!f,useMargins:!t),panels:!((embeddableConfig:(attributes:(references:!((id:bc9f2190-fdfe-11ee-bcd1-05d191e26260,name:indexpattern-datasource-current-indexpattern,type:index-pattern),(id:bc9f2190-fdfe-11ee-bcd1-05d191e26260,name:indexpattern-datasource-layer-3a8df1e5-17a5-43c4-8c56-c211f63752a6,type:index-pattern)),state:(datasourceStates:(indexpattern:(layers:('3a8df1e5-17a5-43c4-8c56-c211f63752a6':(columnOrder:!(ab1da9a6-b6ae-449c-8a1d-81da12d1fe26,d20992fd-e464-433d-84c1-bec79e63bbf5,d20992fd-e464-433d-84c1-bec79e63bbf5X0,d20992fd-e464-433d-84c1-bec79e63bbf5X1,d20992fd-e464-433d-84c1-bec79e63bbf5X2),columns:(ab1da9a6-b6ae-449c-8a1d-81da12d1fe26:(dataType:string,isBucketed:!t,label:Filters,operationType:filters,params:(filters:!((input:(language:kuery,query:'CNF_USE_AM%20%3E%200'),label:'%EC%B2%B4%ED%81%AC%EC%B9%B4%EB%93%9C%20%EC%9D%B4%EC%9A%A9%EA%B8%88%EC%95%A1'),(input:(language:kuery,query:'CRDSL_USE_AM%20%3E0'),label:'%EC%8B%A0%EC%9A%A9%EC%B9%B4%EB%93%9C%20%EC%9D%B4%EC%9A%A9%EA%B8%88%EC%95%A1'))),scale:ordinal),d20992fd-e464-433d-84c1-bec79e63bbf5:(dataType:number,isBucketed:!f,label:'sum(CNF_USE_AM)%20%2B%20sum(CRDSL_USE_AM)',operationType:formula,params:(formula:'sum(CNF_USE_AM)%20%2B%20sum(CRDSL_USE_AM)',isFormulaBroken:!f),references:!(d20992fd-e464-433d-84c1-bec79e63bbf5X2),scale:ratio),d20992fd-e464-433d-84c1-bec79e63bbf5X0:(customLabel:!t,dataType:number,isBucketed:!f,label:'Part%20of%20sum(CNF_USE_AM)%20%2B%20sum(CRDSL_USE_AM)',operationType:sum,scale:ratio,sourceField:CNF_USE_AM),d20992fd-e464-433d-84c1-bec79e63bbf5X1:(customLabel:!t,dataType:number,isBucketed:!f,label:'Part%20of%20sum(CNF_USE_AM)%20%2B%20sum(CRDSL_USE_AM)',operationType:sum,scale:ratio,sourceField:CRDSL_USE_AM),d20992fd-e464-433d-84c1-bec79e63bbf5X2:(customLabel:!t,dataType:number,isBucketed:!f,label:'Part%20of%20sum(CNF_USE_AM)%20%2B%20sum(CRDSL_USE_AM)',operationType:math,params:(tinymathAst:(args:!(d20992fd-e464-433d-84c1-bec79e63bbf5X0,d20992fd-e464-433d-84c1-bec79e63bbf5X1),location:(max:35,min:0),name:add,text:'sum(CNF_USE_AM)%20%2B%20sum(CRDSL_USE_AM)',type:function)),references:!(d20992fd-e464-433d-84c1-bec79e63bbf5X0,d20992fd-e464-433d-84c1-bec79e63bbf5X1),scale:ratio)),incompleteColumns:())))),filters:!(),query:(language:kuery,query:''),visualization:(layers:!((categoryDisplay:default,groups:!(ab1da9a6-b6ae-449c-8a1d-81da12d1fe26),layerId:'3a8df1e5-17a5-43c4-8c56-c211f63752a6',layerType:data,legendDisplay:default,metric:d20992fd-e464-433d-84c1-bec79e63bbf5,nestedLegend:!f,numberDisplay:percent)),palette:(name:default,type:palette),shape:pie)),title:'',type:lens,visualizationType:lnsPie),enhancements:(),hidePanelTitles:!f),gridData:(h:13,i:'8d733ccd-e095-43a7-a6c5-ae80c75cbcd7',w:9,x:0,y:0),panelIndex:'8d733ccd-e095-43a7-a6c5-ae80c75cbcd7',title:'%EC%B9%B4%EB%93%9C%20%EC%9D%B4%EC%9A%A9%20%EB%B9%84%EC%9C%A8',type:lens,version:'7.17.16')),query:(language:kuery,query:''),tags:!(),timeRestore:!f,title:test2,viewMode:view)&hide-filter-bar=true`;
      return `http://52.78.112.2:5601/app/dashboards#/view/e933f340-0059-11ef-9a2c-13b8fdce0975?embed=true&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-15m,to:now))&_a=(description:'',filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'844553f0-007e-11ef-9a2c-13b8fdce0975',key:LIFE_STAGE,negate:!f,params:(query:${this.queryLifeStage}),type:phrase),query:(match_phrase:(LIFE_STAGE:${this.queryLifeStage})))),fullScreenMode:!f,options:(hidePanelTitles:!f,syncColors:!f,useMargins:!t),panels:!((embeddableConfig:(attributes:(references:!((id:'844553f0-007e-11ef-9a2c-13b8fdce0975',name:indexpattern-datasource-current-indexpattern,type:index-pattern),(id:'844553f0-007e-11ef-9a2c-13b8fdce0975',name:indexpattern-datasource-layer-3a8df1e5-17a5-43c4-8c56-c211f63752a6,type:index-pattern)),state:(datasourceStates:(indexpattern:(layers:('3a8df1e5-17a5-43c4-8c56-c211f63752a6':(columnOrder:!(ab1da9a6-b6ae-449c-8a1d-81da12d1fe26,d20992fd-e464-433d-84c1-bec79e63bbf5,d20992fd-e464-433d-84c1-bec79e63bbf5X0,d20992fd-e464-433d-84c1-bec79e63bbf5X1,d20992fd-e464-433d-84c1-bec79e63bbf5X2),columns:(ab1da9a6-b6ae-449c-8a1d-81da12d1fe26:(dataType:string,isBucketed:!t,label:Filters,operationType:filters,params:(filters:!((input:(language:kuery,query:'CNF_USE_AM%20%3E%200'),label:'%EC%B2%B4%ED%81%AC%EC%B9%B4%EB%93%9C%20%EC%9D%B4%EC%9A%A9%EA%B8%88%EC%95%A1'),(input:(language:kuery,query:'CRDSL_USE_AM%20%3E0'),label:'%EC%8B%A0%EC%9A%A9%EC%B9%B4%EB%93%9C%20%EC%9D%B4%EC%9A%A9%EA%B8%88%EC%95%A1'))),scale:ordinal),d20992fd-e464-433d-84c1-bec79e63bbf5:(dataType:number,isBucketed:!f,label:'sum(CNF_USE_AM)%20%2B%20sum(CRDSL_USE_AM)',operationType:formula,params:(formula:'sum(CNF_USE_AM)%20%2B%20sum(CRDSL_USE_AM)',isFormulaBroken:!f),references:!(d20992fd-e464-433d-84c1-bec79e63bbf5X2),scale:ratio),d20992fd-e464-433d-84c1-bec79e63bbf5X0:(customLabel:!t,dataType:number,isBucketed:!f,label:'Part%20of%20sum(CNF_USE_AM)%20%2B%20sum(CRDSL_USE_AM)',operationType:sum,scale:ratio,sourceField:CNF_USE_AM),d20992fd-e464-433d-84c1-bec79e63bbf5X1:(customLabel:!t,dataType:number,isBucketed:!f,label:'Part%20of%20sum(CNF_USE_AM)%20%2B%20sum(CRDSL_USE_AM)',operationType:sum,scale:ratio,sourceField:CRDSL_USE_AM),d20992fd-e464-433d-84c1-bec79e63bbf5X2:(customLabel:!t,dataType:number,isBucketed:!f,label:'Part%20of%20sum(CNF_USE_AM)%20%2B%20sum(CRDSL_USE_AM)',operationType:math,params:(tinymathAst:(args:!(d20992fd-e464-433d-84c1-bec79e63bbf5X0,d20992fd-e464-433d-84c1-bec79e63bbf5X1),location:(max:35,min:0),name:add,text:'sum(CNF_USE_AM)%20%2B%20sum(CRDSL_USE_AM)',type:function)),references:!(d20992fd-e464-433d-84c1-bec79e63bbf5X0,d20992fd-e464-433d-84c1-bec79e63bbf5X1),scale:ratio)),incompleteColumns:())))),filters:!(),query:(language:kuery,query:''),visualization:(layers:!((categoryDisplay:inside,groups:!(ab1da9a6-b6ae-449c-8a1d-81da12d1fe26),layerId:'3a8df1e5-17a5-43c4-8c56-c211f63752a6',layerType:data,legendDisplay:show,legendMaxLines:1,legendPosition:top,metric:d20992fd-e464-433d-84c1-bec79e63bbf5,nestedLegend:!f,numberDisplay:percent,percentDecimals:2,truncateLegend:!t)),palette:(name:gray,type:palette),shape:pie)),title:'',type:lens,visualizationType:lnsPie),enhancements:(),hidePanelTitles:!f),gridData:(h:20,i:'8d733ccd-e095-43a7-a6c5-ae80c75cbcd7',w:16,x:1,y:0),panelIndex:'8d733ccd-e095-43a7-a6c5-ae80c75cbcd7',title:'%EC%B9%B4%EB%93%9C%20%EC%9D%B4%EC%9A%A9%20%EB%B9%84%EC%9C%A8',type:lens,version:'7.17.16'),(embeddableConfig:(attributes:(references:!((id:'844553f0-007e-11ef-9a2c-13b8fdce0975',name:indexpattern-datasource-current-indexpattern,type:index-pattern),(id:'844553f0-007e-11ef-9a2c-13b8fdce0975',name:indexpattern-datasource-layer-77aee5c4-362e-4a97-890a-93a2d54b41e5,type:index-pattern),(id:bc9f2190-fdfe-11ee-bcd1-05d191e26260,name:indexpattern-datasource-layer-5ef92fab-e953-4d20-8995-6d622892d70e,type:index-pattern)),state:(datasourceStates:(indexpattern:(layers:('5ef92fab-e953-4d20-8995-6d622892d70e':(columnOrder:!(),columns:(),incompleteColumns:()),'77aee5c4-362e-4a97-890a-93a2d54b41e5':(columnOrder:!('43ef65df-4710-4f52-a7e9-5a724386017f','7419f504-0d54-4238-84d9-025bde7838d8',ceb89fd3-175c-42ab-8f49-bde843189982,'2f25749c-8e17-4087-b6e6-964caac3c3f8','8448cfc8-4f77-4294-997b-bdc261ec67e9','16860516-67f9-44cd-9535-3af7d9b1bb3a','74400b59-d590-45e9-8b42-02138418f39a',e44ab016-7c0f-407b-be8f-d2af8588e86c,'3fff568f-28b1-438a-9c6f-1ddd9d5bfc16','6c730b0e-5e29-4d6b-9ae7-250b4549ef71','5f460347-54d4-4659-bc23-458b39b08bd7','96f63851-e344-4bae-860b-f5a9c6db6fc5',cf889362-1eab-4493-b25e-de2fd304c8be,'474f72a2-6a80-4a98-b657-66e8529044e7',c3991cb3-eb26-41c9-bf0c-a9cbba2c7978,ef31f31b-cae8-43bb-b26a-690f3a67d4b1,ffff7ebf-4488-4e71-9b67-b3a4b8ab8432,a1f4a9b8-9078-4c30-a611-c77641d1b7d6,'609bab6e-ead8-427b-ac19-2b6540f028b3','11210ec1-9ed0-4b28-ba8d-c1de2b24bc0a','6ed53036-f851-4491-94f3-cdfb477d333a','3ceccdc6-479c-4b73-b21d-955bcaf0cd16',a91eb0fb-4ac0-4554-8fe5-6ebfec73ba40,'6cf5a8a2-ec26-44b8-a47e-4ddbe9c1d526','52733339-d8e6-4cc2-bc58-67d28cc77437',d3fe31bd-81b4-4593-bf93-1d5cd0e8cdac,'3543f209-3ced-46da-a6e0-0dec01c952e3','3c9bff9a-333f-42c0-bdb4-1a12a98d73a6',b67393dc-19e8-40a3-8e39-b7d129a2d614,'09d7e8bc-3b89-4084-9efd-16e812644c94','90c13e04-c1c9-498c-bbd3-d106cdc3ac1c','51440fa6-80ba-4ea9-a60e-a9ba889d00c8','9ebf4feb-6850-4ac0-bcba-522f1f4edb04'),columns:('09d7e8bc-3b89-4084-9efd-16e812644c94':(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%A3%BC%EB%B0%A9%EC%9A%A9%ED%92%88,operationType:sum,scale:ratio,sourceField:KITWR_AM),'11210ec1-9ed0-4b28-ba8d-c1de2b24bc0a':(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%97%B0%EB%A3%8C%ED%8C%90%EB%A7%A4,operationType:sum,scale:ratio,sourceField:FUEL_AM),'16860516-67f9-44cd-9535-3af7d9b1bb3a':(customLabel:!t,dataType:number,isBucketed:!f,label:%EA%B1%B4%EC%B6%95%2F%EC%9E%90%EC%9E%AC,operationType:sum,scale:ratio,sourceField:ARCHIT_AM),'2f25749c-8e17-4087-b6e6-964caac3c3f8':(customLabel:!t,dataType:number,isBucketed:!f,label:%EA%B1%B4%EA%B0%95%EC%8B%9D%ED%92%88,operationType:sum,scale:ratio,sourceField:HLTHFS_AM),'3543f209-3ced-46da-a6e0-0dec01c952e3':(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%9D%BC%EB%B0%98%2F%ED%9C%B4%EA%B2%8C%EC%9D%8C%EC%8B%9D,operationType:sum,params:(),scale:ratio,sourceField:RESTRNT_AM),'3c9bff9a-333f-42c0-bdb4-1a12a98d73a6':(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%9E%90%EB%8F%99%EC%B0%A8%EC%A0%95%EB%B9%84%2F%EC%9C%A0%EC%A7%80,operationType:sum,scale:ratio,sourceField:AUTOMNT_AM),'3ceccdc6-479c-4b73-b21d-955bcaf0cd16':(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%9C%A0%ED%86%B5%EC%97%85%EB%B9%84%EC%98%81%EB%A6%AC,operationType:sum,scale:ratio,sourceField:DISTBNP_AM),'3fff568f-28b1-438a-9c6f-1ddd9d5bfc16':(customLabel:!t,dataType:number,isBucketed:!f,label:%EB%A0%88%EC%A0%B8%EC%97%85%EC%86%8C,operationType:sum,scale:ratio,sourceField:LEISURE_P_AM),'43ef65df-4710-4f52-a7e9-5a724386017f':(dataType:string,isBucketed:!t,label:Filters,operationType:filters,params:(filters:!((input:(language:kuery,query:''),label:''))),scale:ordinal),'474f72a2-6a80-4a98-b657-66e8529044e7':(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%82%AC%EB%AC%B4%2F%ED%86%B5%EC%8B%A0%EA%B8%B0%EA%B8%B0,operationType:sum,scale:ratio,sourceField:OFFCOM_AM),'51440fa6-80ba-4ea9-a60e-a9ba889d00c8':(customLabel:!t,dataType:number,isBucketed:!f,label:%ED%95%99%EC%9B%90,operationType:sum,scale:ratio,sourceField:ACDM_AM),'52733339-d8e6-4cc2-bc58-67d28cc77437':(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%9D%98%EB%A3%8C%EA%B8%B0%EA%B4%80,operationType:sum,scale:ratio,sourceField:HOS_AM),'5f460347-54d4-4659-bc23-458b39b08bd7':(customLabel:!t,dataType:number,isBucketed:!f,label:%EB%AC%B8%ED%99%94%2F%EC%B7%A8%EB%AF%B8,operationType:sum,scale:ratio,sourceField:CULTURE_AM),'609bab6e-ead8-427b-ac19-2b6540f028b3':(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%97%AC%ED%96%89%EC%97%85,operationType:sum,scale:ratio,sourceField:TRVL_AM),'6c730b0e-5e29-4d6b-9ae7-250b4549ef71':(customLabel:!t,dataType:number,isBucketed:!f,label:%EB%A0%88%EC%A0%B8%EC%9A%A9%ED%92%88,operationType:sum,scale:ratio,sourceField:LEISURE_S_AM),'6cf5a8a2-ec26-44b8-a47e-4ddbe9c1d526':(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%9D%8C%EC%8B%9D%EB%A3%8C%ED%92%88,operationType:sum,scale:ratio,sourceField:GROCERY_AM),'6ed53036-f851-4491-94f3-cdfb477d333a':(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%9A%A9%EC%97%AD%EC%84%9C%EB%B9%84%EC%8A%A4,operationType:sum,scale:ratio,sourceField:SVC_AM),'7419f504-0d54-4238-84d9-025bde7838d8':(customLabel:!t,dataType:number,isBucketed:!f,label:%EA%B0%80%EA%B5%AC,operationType:sum,scale:ratio,sourceField:FUNITR_AM),'74400b59-d590-45e9-8b42-02138418f39a':(customLabel:!t,dataType:number,isBucketed:!f,label:%EA%B4%91%ED%95%99%EC%A0%9C%ED%92%88,operationType:sum,scale:ratio,sourceField:OPTIC_AM),'8448cfc8-4f77-4294-997b-bdc261ec67e9':(customLabel:!t,dataType:number,isBucketed:!f,label:%EA%B1%B4%EB%AC%BC%EB%B0%8F%EC%8B%9C%EC%84%A4%EA%B4%80%EB%A6%AC,operationType:sum,scale:ratio,sourceField:BLDMNG_AM),'90c13e04-c1c9-498c-bbd3-d106cdc3ac1c':(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%A7%81%EB%AC%BC,operationType:sum,scale:ratio,sourceField:FABRIC_AM),'96f63851-e344-4bae-860b-f5a9c6db6fc5':(customLabel:!t,dataType:number,isBucketed:!f,label:%EB%B3%B4%EA%B1%B4%2F%EC%9C%84%EC%83%9D,operationType:sum,scale:ratio,sourceField:SANIT_AM),'9ebf4feb-6850-4ac0-bcba-522f1f4edb04':(customLabel:!t,dataType:number,isBucketed:!f,label:%ED%9A%8C%EC%9B%90%EC%A0%9C%ED%98%95%ED%83%9C%EC%97%85%EC%86%8C,operationType:sum,params:(),scale:ratio,sourceField:MBRSHOP_AM),a1f4a9b8-9078-4c30-a611-c77641d1b7d6:(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%8B%A0%EB%B3%80%EC%9E%A1%ED%99%94,operationType:sum,scale:ratio,sourceField:GOODS_AM),a91eb0fb-4ac0-4554-8fe5-6ebfec73ba40:(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%9C%A0%ED%86%B5%EC%97%85%EC%98%81%EB%A6%AC,operationType:sum,scale:ratio,sourceField:DISTBP_AM),b67393dc-19e8-40a3-8e39-b7d129a2d614:(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%9E%90%EB%8F%99%EC%B0%A8%ED%8C%90%EB%A7%A4,operationType:sum,scale:ratio,sourceField:AUTOSL_AM),c3991cb3-eb26-41c9-bf0c-a9cbba2c7978:(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%84%9C%EC%A0%81%2F%EB%AC%B8%EA%B5%AC,operationType:sum,scale:ratio,sourceField:BOOK_AM),ceb89fd3-175c-42ab-8f49-bde843189982:(customLabel:!t,dataType:number,isBucketed:!f,label:%EA%B0%80%EC%A0%84%EC%A0%9C%ED%92%88,operationType:sum,scale:ratio,sourceField:APPLNC_AM),cf889362-1eab-4493-b25e-de2fd304c8be:(customLabel:!t,dataType:number,isBucketed:!f,label:%EB%B3%B4%ED%97%98,operationType:sum,scale:ratio,sourceField:INSU_AM),d3fe31bd-81b4-4593-bf93-1d5cd0e8cdac:(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%9D%98%EB%A5%98,operationType:sum,scale:ratio,sourceField:CLOTH_AM),e44ab016-7c0f-407b-be8f-d2af8588e86c:(customLabel:!t,dataType:number,isBucketed:!f,label:%EB%86%8D%EC%97%85,operationType:sum,scale:ratio,sourceField:AGRICTR_AM),ef31f31b-cae8-43bb-b26a-690f3a67d4b1:(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%88%98%EB%A6%AC%EC%84%9C%EB%B9%84%EC%8A%A4,operationType:sum,scale:ratio,sourceField:RPR_AM),ffff7ebf-4488-4e71-9b67-b3a4b8ab8432:(customLabel:!t,dataType:number,isBucketed:!f,label:%EC%88%99%EB%B0%95%EC%97%85,operationType:sum,scale:ratio,sourceField:HOTEL_AM)),incompleteColumns:())))),filters:!(),query:(language:kuery,query:''),visualization:(axisTitlesVisibilitySettings:(x:!t,yLeft:!t,yRight:!t),fittingFunction:None,gridlinesVisibilitySettings:(x:!t,yLeft:!t,yRight:!t),labelsOrientation:(x:-45,yLeft:0,yRight:0),layers:!((accessors:!('7419f504-0d54-4238-84d9-025bde7838d8',ceb89fd3-175c-42ab-8f49-bde843189982,'2f25749c-8e17-4087-b6e6-964caac3c3f8','8448cfc8-4f77-4294-997b-bdc261ec67e9','16860516-67f9-44cd-9535-3af7d9b1bb3a','74400b59-d590-45e9-8b42-02138418f39a',e44ab016-7c0f-407b-be8f-d2af8588e86c,'3fff568f-28b1-438a-9c6f-1ddd9d5bfc16','6c730b0e-5e29-4d6b-9ae7-250b4549ef71','5f460347-54d4-4659-bc23-458b39b08bd7','96f63851-e344-4bae-860b-f5a9c6db6fc5',cf889362-1eab-4493-b25e-de2fd304c8be,'474f72a2-6a80-4a98-b657-66e8529044e7',c3991cb3-eb26-41c9-bf0c-a9cbba2c7978,ef31f31b-cae8-43bb-b26a-690f3a67d4b1,ffff7ebf-4488-4e71-9b67-b3a4b8ab8432,a1f4a9b8-9078-4c30-a611-c77641d1b7d6,'609bab6e-ead8-427b-ac19-2b6540f028b3','11210ec1-9ed0-4b28-ba8d-c1de2b24bc0a','6ed53036-f851-4491-94f3-cdfb477d333a','3ceccdc6-479c-4b73-b21d-955bcaf0cd16',a91eb0fb-4ac0-4554-8fe5-6ebfec73ba40,'6cf5a8a2-ec26-44b8-a47e-4ddbe9c1d526','52733339-d8e6-4cc2-bc58-67d28cc77437',d3fe31bd-81b4-4593-bf93-1d5cd0e8cdac,'3543f209-3ced-46da-a6e0-0dec01c952e3','3c9bff9a-333f-42c0-bdb4-1a12a98d73a6',b67393dc-19e8-40a3-8e39-b7d129a2d614,'09d7e8bc-3b89-4084-9efd-16e812644c94','90c13e04-c1c9-498c-bbd3-d106cdc3ac1c','51440fa6-80ba-4ea9-a60e-a9ba889d00c8','9ebf4feb-6850-4ac0-bcba-522f1f4edb04'),layerId:'77aee5c4-362e-4a97-890a-93a2d54b41e5',layerType:data,seriesType:bar_horizontal,xAccessor:'43ef65df-4710-4f52-a7e9-5a724386017f',yConfig:!((axisMode:auto,forAccessor:'3543f209-3ced-46da-a6e0-0dec01c952e3'))),(accessors:!(),layerId:'5ef92fab-e953-4d20-8995-6d622892d70e',layerType:data,seriesType:bar_horizontal)),legend:(isInside:!f,isVisible:!t,position:right,shouldTruncate:!t,showSingleSeries:!t),preferredSeriesType:bar_horizontal,tickLabelsVisibilitySettings:(x:!t,yLeft:!t,yRight:!t),valueLabels:inside,valuesInLegend:!f,xTitle:'%EB%8F%88%EC%9D%84%20%EC%93%B4%20%EB%B6%84%EC%95%BC',yLeftExtent:(mode:full),yRightExtent:(mode:full),yTitle:%EC%95%A1%EC%88%98)),title:'',type:lens,visualizationType:lnsXY),enhancements:(),hidePanelTitles:!f),gridData:(h:20,i:'182327fa-b404-449c-9eab-b123797620ed',w:31,x:17,y:0),panelIndex:'182327fa-b404-449c-9eab-b123797620ed',title:'%EB%B6%84%EC%95%BC%20%EB%B3%84%20%EB%8F%88%EC%9D%84%20%EC%93%B4%20%EC%95%A1%EC%88%98',type:lens,version:'7.17.16')),query:(language:kuery,query:''),tags:!(),timeRestore:!f,title:test2,viewMode:view)&hide-filter-bar=true`;
    }
 
  },
  data() {
    return {
      loading: false, // 로딩 상태를 추적하는 데이터
      adminResponse: null,
      // 아래는 ELK 그래프 그리기에 필요한 변수
      querySEQ: null, 
      queryLifeStage: null,
      activeTab: 'tab1',
      tabs:[
        { name: 'tab1', title: '나의 소비' },
        { name: 'tab2', title: '소비 비교' }
      ],
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
      ],
      spendCategory: '',
      categoryName: '',
      categoryAmt: 0,
      displayMessage: '',
      quarterComparison: null,
      maxSpendingData: null,
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
       }
    };
  },
  mounted() {
    this.accessAdminPage(); // 페이지 로드 시 머신러닝 예측 자동 실행
    this.fetchELKDataUsingToken();
    this.fetchMaxSpendingData();
  },
  methods: {
    selectTab(tab) {
      this.activeTab = tab.name;
    },

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
        const token = this.getToken; // Vuex 스토어에서 토큰 가져오기

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

        this.quarterComparison = response.data.data;
        console.log(quarterComparison);

      } catch (error) {
        console.error('분기 비교 데이터 로드 실패:', error.response);
      } finally {
        this.loading = false;
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

        this.spendCategory = response.data.data;
        console.log(this.spendCategory);

        if (!this.spendCategory) {
          this.displayMessage = "데이터가 없습니다";
        } else {
          const { amt, category } = this.spendCategory;
          this.categoryName = this.categoryMap[category] || "분류되지 않은 카테고리";
          this.categoryAmt = amt * 1000;
          this.displayMessage = '';
        }
      } catch (error) {
        console.error('최대 지출 데이터 로드 실패:', error.response);
        this.displayMessage = "데이터 로드에 실패했습니다";
      } finally {
        this.loading = false;
      }
    }
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

.app-header h1 {
  color: #333;
  font-size: 24px;
  font-weight: 400;
  margin-bottom: 20px;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  width: 100%;
}

.tabs button {
  flex: 1;
  background-color: #0056b3;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-right: 5px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.tabs button:hover {
  background-color: #004494; /* Slightly darker blue on hover */
  box-shadow: 0 2px 10px rgba(0,0,0,0.1); /* Soft shadow for 3D effect */
}

.tabs button.active-tab {
  font-weight: bold;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  background-color: ##004494;
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
  background-color: #fff398; /* White background for cards */
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Subtle shadow for depth */
  margin-bottom: 10px; /* Spacing between cards */
  text-align: center; /* Center text for better readability */
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* font-size: 40px !important; */
}
.spend-category-card h3{
  font-size: 20px;
  font-weight: bold;
  font-family: 'Open Sans';
}

.category-cards-container {
  display: flex;
  justify-content: space-between;
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
</style>

