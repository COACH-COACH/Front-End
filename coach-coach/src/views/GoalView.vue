<template>
    <div class="goal">
        <div class="container">
        <AdvisorComponent/>
        </div>
        <GoalComponent/>
    </div>
</template>

<script>
import GoalComponent from '../components/GoalAndProductComponent.vue'
import AdvisorComponent from '../components/AdvisorComponent.vue'

export default {
    components: {
        GoalComponent,
        AdvisorComponent
    }
}
</script>