<template>
    <div class="product-detail-container">
        <h2>{{ product.productName }}</h2>
        <div class="details">
            <p><strong>상품 유형:</strong> {{ product.productType }}</p>
            <p><strong>최대 금리:</strong> {{ product.maxInterestRate }}%</p>
            <p><strong>기본 금리:</strong> {{ product.interestRate }}%</p>
            <p><strong>상품 설명:</strong> {{ product.productDetail }}</p>
            <p><strong>납입 주기:</strong> {{ product.depositCycle }}</p>
            <p><strong>만기 기간:</strong> {{ product.maturity }}년</p>
            <p><strong>가입 조건:</strong> {{ product.membershipCondition }}</p>
            <p><strong>가입 대상:</strong> {{ product.eligibility }}</p>
            <p><strong>주의 사항:</strong> {{ product.caution }}</p>
            <p><strong>가입 한도:</strong> {{ product.limitAmt | currencyFormat }}</p>
        </div>
        <button @click="enroll">가입하기</button>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
    name: 'ProductDetailView',
    props: {
        pid: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const router = useRouter();
        const product = ref({});

        // 데이터를 가져오는 함수
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/product/detail/${props.pid}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJsb2dpbklkIjoic2hpbiIsImlhdCI6MTcxMzQxOTAxMiwiZXhwIjoxNzEzNDc5MDEyfQ.2SFl92HddkC7316Tf63BdLXGH4i3Gib_8iUc646eQCw'
                    }
                });

                if (!response.ok) throw new Error('Failed to fetch product details');
                const data = await response.json();
                product.value = data.data;
            } catch (error) {
                console.error(error);
            }
        };

        // 가입하기 버튼의 로직
        const enroll = () => {
            console.log('상품 가입:', product.value.productName);
            // TODO: 가입 로직
        };

        // 컴포넌트가 마운트될 때 데이터를 로드
        onMounted(fetchProductDetails);

        return {
            product,
            enroll
        };
    }
};
</script>

<style scoped>
.product-detail-container {
    max-width: 600px;
    margin: auto;
    padding: 20px;
}

.details p {
    margin: 5px 0;
    line-height: 1.5;
}

button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>