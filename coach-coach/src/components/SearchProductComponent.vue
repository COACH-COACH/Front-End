<template>
  <div>
    <h3>예적금 상품 검색</h3>
    <div>
      <div>
        종류: <button v-for="type in productTypes" :key="type.value" @click="setFilter('productType', type.value)" :class="{ 'btn-active': filters.productType === type.value }">{{ type.text }}</button>
      </div>

      <div v-if="filters.productType === 'SAVINGS'">
        납입 주기: <button v-for="cycle in depositCycles" :key="cycle.value" @click="setFilter('depositCycle', cycle.value)" :class="{ 'btn-active': filters.depositCycle === cycle.value }">{{ cycle.text }}</button>
      </div>
    </div>

    <div>
      가입기간: <button v-for="period in maturityOptions" :key="period.value" @click="setFilter('maturity', period.value)" :class="{ 'btn-active': filters.maturity === period.value }">{{ period.text }}</button>
    </div>

    <div>
      <label for="keyword">검색 키워드: </label>
      <input type="text" v-model="filters.keyword">
    </div>

    <button @click="searchProducts">조회</button>

    <div v-if="products && products.length">
      <ul>
        <li v-for="product in products" :key="product.id" class="product-item">
          <div class="rate-info">
            <span class="rate-label">최대 금리</span>
            <span class="rate-value">{{ product.maxInterestRate }}%</span>
          </div>
          <div class="product-info">
            <span class="product-type">{{ product.productType }} - {{ product.depositCycle }}</span>
            <strong class="product-name">{{ product.productName }}</strong>
            <span class="product-detail">{{ product.productDetail }}</span>
          </div>
        </li>
      </ul>
    </div>
    <div v-else>
        상품 정보가 없습니다.
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
import { ref, computed } from 'vue';

export default {
  name: 'SearchProductComponent',
  setup() {
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

    const products = ref([]);

    const setFilter = (filter, value) => {
      filters.value[filter] = value;
    };

    const searchProducts = async () => {
      const payload = {
          productType: filters.value.productType || null,
          maturity: filters.value.maturity || null,
          depositCycle: filters.value.depositCycle || null,
          keyword: filters.value.keyword || null
      };

      try {
          const response = await fetch(`http://localhost:8080/product/search?page=${pagination.value.currentPage}&size=${pagination.value.pageSize}`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJsb2dpbklkIjoic2hpbiIsImlhdCI6MTcxMzMyNDg5NCwiZXhwIjoxNzEzMzg0ODk0fQ.Rqvo55AwfXh7UbPTImhNRezPZjQQhd8BzEsJTsGcO4w'
              },
              body: JSON.stringify(payload)
          });

          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          const responseData = await response.json();
          products.value = responseData.data.products;
          pagination.value = responseData.data.pagenation;
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

    return { filters, products, pagination, productTypes, depositCycles, maturityOptions, setFilter, searchProducts, changePage, pagesToShow };
  }
};
</script>

<style>
.btn-active {
  background-color: #007bff; /* Blue background for active state */
  color: white; /* White text color for better contrast */
  border: none;
}

button {
  margin: 2px;
  padding: 5px 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button:disabled {
  background-color: #ccc;
  color: #666;
}

input[type="text"] {
  padding: 5px;
  margin-top: 5px;
}
.product-list {
  list-style-type: none;
  padding: 0;
}

.product-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.rate-section {
  margin-right: 20px;
  text-align: center;
}

.rate-label {
  display: block;
  font-size: small;
  color: gray;
}

.rate-value {
  font-size: larger;
  color: orange;
  font-weight: bold;
}

.product-details {
  flex-grow: 1;
}

.product-type {
  font-size: small;
  color: gray;
}

.product-name {
  display: block;
  font-weight: bold;
  color: black;
}

.product-description {
  font-size: small;
  color: darkgray;
}
</style>
