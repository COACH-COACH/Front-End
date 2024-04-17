<template>
    <div class="product">
        <h1>This is an product page</h1>
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