<template>
    <div class="product">
        <SearchProductComponent/>
    </div>
</template>

<script>
import SearchProductComponent from '@/components/SearchProductComponent.vue'

export default {
    name: 'ProductView',
    components: {
        SearchProductComponent
    }
}
</script>