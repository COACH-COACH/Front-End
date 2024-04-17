<template>
    <div>
      <h1>상품 검색</h1>
      <div>
        <label for="productType">상품 종류:</label>
        <select v-model="filters.productType" @change="onProductTypeChange">
          <option value="">전체</option>
          <option value="DEPOSIT">예금</option>
          <option value="SAVINGS">적금</option>
        </select>
  
        <div v-if="filters.productType === 'SAVINGS'">
          <label for="depositCycle">납입 방법:</label>
          <select v-model="filters.depositCycle">
            <option value="">전체</option>
            <option value="FLEXIBLE">자유적립식</option>
            <option value="FIXED">정액적립식</option>
          </select>
        </div>
      </div>
  
      <div>
        <label for="maturity">가입 기간:</label>
        <select v-model="filters.maturity">
          <option value="">전체</option>
          <option value="1">1개월</option>
          <option value="3">3개월</option>
          <option value="6">6개월</option>
          <option value="12">1년</option>
          <option value="24">2년</option>
          <option value="36">3년 이상</option>
        </select>
      </div>
  
      <div>
        <label for="keyword">검색 키워드:</label>
        <input type="text" v-model="filters.keyword">
      </div>
  
      <button @click="searchProducts">조회</button>
  
      <div v-if="products && products.length">
        <ul>
          <li v-for="product in products" :key="product.id">
            {{ product.productName }} ({{ product.productType }} - {{ product.depositCycle }}) - {{ product.maxInterestRate }}% - {{ product.productDetail }}
          </li>
        </ul>
      </div>
      <div v-else>
            상품 정보가 없습니다.
        </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    name: 'SearchProductComponent',
    setup() {
      const filters = ref({
        productType: '',
        maturity: '',
        depositCycle: '',
        keyword: ''
      });
  
      const products = ref([]);
  
      const onProductTypeChange = () => {
        if (filters.value.productType !== 'SAVINGS') {
          filters.value.depositCycle = '';
        }
      };
  
      const searchProducts = async () => {
        const payload = {
            productType: filters.value.productType || null,
            maturity: filters.value.maturity || null,
            depositCycle: filters.value.depositCycle || null,
            keyword: filters.value.keyword || null
        };

        console.log("Request Body:", JSON.stringify(payload)); // 요청 본문 출력

        try {
            const response = await fetch(`http://localhost:8080/product/search?page=0&size=10`, {
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
            console.log("Product Response Data:", products.value)
        } catch (error) {
            console.error("Error during fetch:", error.message);
        }
      };

      return { filters, products, onProductTypeChange, searchProducts };
    }
  };
  </script>
  
  <style>
  /* 스타일은 필요에 따라 추가 */
  </style>
  