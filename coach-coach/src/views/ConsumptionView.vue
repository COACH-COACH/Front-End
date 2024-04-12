<template>
  <div>
    <h1>소비 탭이요</h1>
    <TimeSeriesPrediction />
    <!-- <ChildComponent2 /> -->
  </div>
</template>

<script>
import TimeSeriesPrediction from '@/components/TimeSeriesPrediction.vue';
// import ChildComponent2 from './ChildComponent2.vue';

export default {
  components: {
    TimeSeriesPrediction
    // ChildComponent2
  }
};
</script>
