<template>
    <div class="product">
        <RecommendationComponent/>
        <SearchProductComponent/>
    </div>
</template>

<script>
import RecommendationComponent from '@/components/ProductRecommendation.vue'
import SearchProductComponent from '@/components/SearchProductComponent.vue'

export default {
    name: 'ProductView',
    components: {
        RecommendationComponent, 
        SearchProductComponent
    }
}
</script>