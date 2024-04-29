<template>
  <div class="search-page">
    <h2>예적금 상품 검색</h2>
    <div class="filters">
      <div class="filter-buttons-group">
        <label class="filter">
          종류 :
          <div class="filter-buttons">
            <button v-for="type in productTypes" :key="type.value" @click="setFilter('productType', type.value)"
                    :class="{ 'btn-active': filters.productType === type.value }">{{ type.text }}</button>
          </div>
        </label>

        <label v-if="filters.productType === 'SAVINGS'" class="filter">
          납입 주기 :
          <div class="filter-buttons">
            <button v-for="cycle in depositCycles" :key="cycle.value" @click="setFilter('depositCycle', cycle.value)"
                    :class="{ 'btn-active': filters.depositCycle === cycle.value }">{{ cycle.text }}</button>
          </div>
        </label>

        <label class="filter">
          가입기간 :
          <div class="filter-buttons">
            <button v-for="period in maturityOptions" :key="period.value" @click="setFilter('maturity', period.value)"
                    :class="{ 'btn-active': filters.maturity === period.value }">{{ period.text }}</button>
          </div>
        </label>
      </div>

      <div class="search-filter">
        <input type="text" v-model="filters.keyword" placeholder="검색 키워드">
        <button @click="searchProducts">조회</button>
      </div>
    </div>
    <div class="sort-button">
      <button @click="sortProductsByRate">높은 금리순</button>
    </div>

    <div class="products">
      <div v-if="products && products.length" class="product-list">
        <div v-for="product in products" :key="product.id" class="product-item">          
            <div class="product-rate">
              <div class="rate-circle">
                <span class="rate-value">{{ product.maxInterestRate }}%</span>
                <span class="rate-duration">({{ product.maturity }}개월 제시)</span>
              </div>
            </div>
            <div class="product-info">
              <div class="product-name">{{ product.productName }}</div>
              {{ product.productType }} | {{ product.depositCycle }} |
              {{ product.productDetail }}
            </div>
            <div class="product-actions">
              <button @click="viewDetails(product.id)">상세보기</button>
            </div>
          </div>
        </div>
        <div v-else class="no-products">상품 정보가 없습니다.</div>
      </div>

    <div>
      <button @click="changePage(pagination.currentPage - 1)" :disabled="pagination.currentPage <= 0">이전</button>
      <button v-if="pagination.currentPage > 3" @click="changePage(0)">...</button>
      <span v-if="pagination.currentPage > 3 && pagination.currentPage - 3 > 1">...</span>
      <button v-for="page in pagesToShow" :key="page" @click="changePage(page - 1)" :class="{ 'btn-active': pagination.currentPage === page - 1 }">
        {{ page }}
      </button>
      <span v-if="pagination.currentPage < pagination.totalPages - 4 && pagination.totalPages - pagination.currentPage - 4 > 1">...</span>
      <button v-if="pagination.currentPage < pagination.totalPages - 4" @click="changePage(pagination.totalPages - 1)">...</button>
      <button @click="changePage(pagination.currentPage + 1)" :disabled="pagination.currentPage >= pagination.totalPages - 1">다음</button>
    </div>
  </div>
</template>


<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'SearchProductComponent',
  setup() {
    const store = useStore(); // Vuex 스토어 사용
    const token = computed(() => store.getters.getToken); // Vuex getter 사용

    const productTypes = [
      { text: '전체', value: '' },
      { text: '예금', value: 'DEPOSIT' },
      { text: '적금', value: 'SAVINGS' }
    ];
    const depositCycles = [
      { text: '전체', value: '' },
      { text: '자유적립식', value: 'FLEXIBLE' },
      { text: '정액적립식', value: 'FIXED' }
    ];
    const maturityOptions = [
      { text: '전체', value: '' },
      { text: '1개월', value: '1' },
      { text: '3개월', value: '3' },
      { text: '6개월', value: '6' },
      { text: '1년', value: '12' },
      { text: '2년', value: '24' },
      { text: '3년 이상', value: '36' }
    ];
    const pagination = ref({
      totalElements: 0,
      totalPages: 0,
      currentPage: 0,
      pageSize: 10
    });

    const filters = ref({
      productType: '',
      maturity: '',
      depositCycle: '',
      keyword: ''
    });

    const router = useRouter();
    const products = ref([]);

    function enroll(productId) {
      // TODO: 가입 로직 구현
      console.log('Enrolling in product:', productId);
    }

    function viewDetails(productId) {
      router.push({ name: 'productdetail', params: { pid: productId } });
    }

    const setFilter = (filter, value) => {
      filters.value[filter] = value;
    };

    const sortProductsByRate = () => {
      products.value.sort((a, b) => parseFloat(b.maxInterestRate) - parseFloat(a.maxInterestRate));
    };

    const searchProducts = async () => {
      console.log("토큰 체크:", token.value)
      const payload = {
          productType: filters.value.productType || null,
          maturity: filters.value.maturity || null,
          depositCycle: filters.value.depositCycle || null,
          keyword: filters.value.keyword || null
      };

      try {
        if (!token.value) {
          console.error('토큰이 없습니다. 로그인 후 다시 시도해주세요.');
          return;
        }

        const response = await fetch(`${process.env.VUE_APP_API_URL}/product/search?page=${pagination.value.currentPage}&size=${pagination.value.pageSize}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token.value}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        products.value = responseData.data.products;
        pagination.value = responseData.data.pagenation;
        
        products.value = products.value.sort((a, b) => {
          const aIncludesKeyword = a.productName.includes('우리') || a.productName.includes('WON');
          const bIncludesKeyword = b.productName.includes('우리') || b.productName.includes('WON');
          if (aIncludesKeyword && !bIncludesKeyword) {
            return -1;
          } else if (!aIncludesKeyword && bIncludesKeyword) {
            return 1;
          }
          return 0; // 둘 다 포함하거나 둘 다 포함하지 않는 경우에는 순서를 변경하지 않습니다.
        });       
          
      } catch (error) {
          console.error("서버 통신 오류:", error.message);
      }
    };

    const changePage = (newPage) => {
      pagination.value.currentPage = newPage;
      searchProducts();
    };

    const pagesToShow = computed(() => {
      let pages = [];
      let startPage = Math.max(pagination.value.currentPage - 2, 0);
      let endPage = Math.min(startPage + 5, pagination.value.totalPages);

      for (let i = startPage; i < endPage; i++) {
        pages.push(i + 1); // display pages as 1-indexed
      }
      return pages;
    });

    onMounted(() => {
      searchProducts();
    });
    return { filters, products, pagination, productTypes, depositCycles, maturityOptions, setFilter, searchProducts, changePage, pagesToShow, enroll, viewDetails, searchProducts, sortProductsByRate };
  }
};
</script>

<style>
.rate-circle {
  width: 125px; /* 원의 크기 조정 */
  height: 125px; /* 원의 크기 조정 */
  border-radius: 50%;
  background-color: #f2f2f2;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-right: 20px; /* 오른쪽 여백 추가 */
}

.rate-value {
  font-size: 1.5em;
  color: #d32f2f;
  font-weight: bold;
}

.rate-duration {
  font-size: 0.5em;
  color: #777;
}

.product-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column; /* 세부 정보를 위한 세로 정렬 */
}

.search-page {
  max-width: 1200px;
  margin: auto;
  padding: 20px;
  background-color: #fff;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  padding-top: 20px; /* 위쪽 패딩 추가 */
  padding-left: 40px;
  padding-bottom: 20px; /* 아래쪽 패딩 추가 */
  margin-bottom: 20px; /* 필터 아래에 여백 추가 */
  background-color: rgb(0,103,172); /* 배경색 적용 */
  border-radius: 10px; /* 경계선을 약간 둥글게 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 배경색과 어울리는 그림자 효과 */
  color: white; /* 텍스트 색상을 흰색으로 변경 */

}

.filter {
  display: flex;
  align-items: center;
  margin-right: 20px; /* 추가: 필터 간 여백 조절 */
  padding-bottom: 10px; /* 필터 바텀 패딩 */
}

.filter label {
  font-weight: bold; /* 추가: 라벨 볼드 처리 */
  margin-right: 10px; /* 추가: 라벨과 버튼 사이의 간격 */
}

.filter-buttons-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-start;
}

.filter-buttons button {
  padding: 10px 20px; /* 변경: 버튼 패딩 증가 */
  border: 2px solid transparent;;
  background-color: #f3f3f4;
  border-radius: 20px; /* 변경: 둥근 모서리 반경 조정 */
  font-size: 0.9em; /* 변경: 폰트 크기 조정 */
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
  margin-right: 10px;
}

.filter-buttons button.btn-active,
.filter-buttons button:hover {
  background-color: rgb(32, 196, 244); /* 변경: 활성화 및 호버 색상 */
  color: white;
  border-color: rgb(32, 196, 244);
}

.search-filter {
  display: flex;
  flex-grow: 1;
  gap: 10px;
}

.search-filter input {
  flex-grow: 1;
  padding: 10px 20px;
  font-size: 1.1em;
  border: none; /* 변경: 테두리 강조 */
  border-radius: 20px; /* 추가: 입력 필드 둥근 모서리 */
  /* margin-right: 10px; */
}

.search-filter button {
  padding: 10px 20px; /* 변경: 패딩 조정 */
  margin-left: 10px; /* 추가: 입력 필드와 버튼 사이의 간격 */
  margin-right: 20px;
  background-color: rgb(32, 196, 244); /* 변경: 버튼 배경색 */
  color: white;
  border: none;
  border-radius: 20px; /* 추가: 버튼 둥근 모서리 */
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-filter button:hover {
  background-color: #0056b3; /* 변경: 버튼 호버 색상 */
}

.sort-button {
  margin-top: 5px; /* 상단 간격 추가 */
  margin-bottom: 10px; /* 상단 간격 추가 */
}

.sort-button button {
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.sort-button button:hover {
  background-color: #003366;
}

.product-list {
  border-top: 1px solid #eee;
}

.product-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.product-info {
  flex-grow: 1;
}

.product-rate {
  font-size: 1.5em;
  color: rgb(0, 103, 172);
}

.product-actions button {
  padding: 5px 15px;
  background-color:  rgb(0, 131, 202);
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.product-actions button:hover {
  background-color: #003366; /* 호버 효과 */
}

.product-name {
  font-size: 1.5em; /* 상품명 폰트 크기 증가 */
  color: rgb(0, 103, 172); /* 상품명 색상 지정 */
  font-weight: bold; /* 글씨 굵게 */
  margin-bottom: 5px; /* 아래쪽 여백 */
  background: none; /* 배경색 제거 */
  border: none; /* 테두리 제거 */
  padding: 0; /* 패딩 제거 */
  margin: 0; /* 여백 제거 */
}

.no-products {
  text-align: center;
  padding: 20px;
  font-size: 1.1em;
}
</style>