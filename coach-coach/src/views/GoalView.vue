<template>
    <div class="goal">
        <div class="bg-color">
            <div class="container">
                <AdvisorComponent/>
            </div>
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

<style scoped>
/* .bg-color{
    background-color: #EAF5FD;
} */
</style>