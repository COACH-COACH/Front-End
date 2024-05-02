<template>
    <div class="goal">
        <div class="container">
        <AdvisorComponent/>
        <img src="https://ifh.cc/g/S8gatw.png" width="100px">
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