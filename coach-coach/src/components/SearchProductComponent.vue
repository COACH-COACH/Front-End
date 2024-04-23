<template>
  <div class="search-page">
    <h3>예적금 상품 검색</h3>
    <div class="filters">
      <label class="filter">
        종류:
        <div class="filter-buttons">
          <button v-for="type in productTypes" :key="type.value" @click="setFilter('productType', type.value)"
                  :class="{ 'btn-active': filters.productType === type.value }">{{ type.text }}</button>
        </div>
      </label>

      <label v-if="filters.productType === 'SAVINGS'" class="filter">
        납입 주기:
        <div class="filter-buttons">
          <button v-for="cycle in depositCycles" :key="cycle.value" @click="setFilter('depositCycle', cycle.value)"
                  :class="{ 'btn-active': filters.depositCycle === cycle.value }">{{ cycle.text }}</button>
        </div>
      </label>

      <label class="filter">
        가입기간:
        <div class="filter-buttons">
          <button v-for="period in maturityOptions" :key="period.value" @click="setFilter('maturity', period.value)"
                  :class="{ 'btn-active': filters.maturity === period.value }">{{ period.text }}</button>
        </div>
      </label>

      <div class="filter search-filter">
        <input type="text" v-model="filters.keyword" placeholder="검색 키워드">
        <button @click="searchProducts">조회</button>
      </div>
    </div>

    <div class="products">
      <div v-if="products && products.length" class="product-list">
        <div v-for="product in products" :key="product.id" class="product-item">
          <div class="product-info">
            <div class="product-rate">
              최대 금리: <strong>{{ product.maxInterestRate }}%</strong>
            </div>
            <div class="product-details">
              {{ product.productType }} | {{ product.depositCycle }}
              <strong>{{ product.productName }}</strong>
              {{ product.productDetail }}
            </div>
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

        const response = await fetch(`http://localhost:8080/product/search?page=${pagination.value.currentPage}&size=${pagination.value.pageSize}`, {
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
    return { filters, products, pagination, productTypes, depositCycles, maturityOptions, setFilter, searchProducts, changePage, pagesToShow, enroll, viewDetails, searchProducts };
  }
};
</script>

<style>
.search-page {
  max-width: 1200px;
  margin: auto;
  padding: 20px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.filter {
  display: flex;
  align-items: center;
}

.filter-buttons button {
  margin-right: 5px;
  padding: 5px 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #fff;
}

.filter-buttons button.btn-active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.search-filter {
  display: flex;
  flex-grow: 1;
}

.search-filter input {
  flex-grow: 1;
  margin-right: 5px;
  padding: 5px;
}

.product-list {
  border-top: 1px solid #eee;
}

.product-item {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.product-info {
  flex-grow: 1;
}

.product-rate {
  font-size: 1.5em;
  color: #d32f2f;
}

.product-details {
  font-size: 0.9em;
}

.product-actions button {
  margin-left: 10px;
  padding: 5px 10px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
}

.no-products {
  text-align: center;
  padding: 20px;
  font-size: 1.1em;
}
</style>