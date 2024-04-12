<template>
  <div class="base">
    <!-- Component1 -->
    <HelloWorld msg="BaseView.vue 파일에서 보낸 메시지"/>
    <hr class="divider"/>
    <!-- Component2 -->
    <PostComponent/>
    <div class="container">
    <div class="left-panel">
      <GetComponent />
    </div>
    <div class="right-panel">
      <TimeSeriesPrediction />
    </div>
  </div>
  </div>
</template>


<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import GetComponent from '@/components/GetTestComponent.vue'
import PostComponent from '@/components/PostTestComponent.vue'
import TimeSeriesPrediction from '@/components/TimeSeriesPrediction.vue'

export default {
  name: 'BaseView',
  components: {
    HelloWorld, GetComponent, PostComponent, TimeSeriesPrediction
  }
}
</script>

<style>
  .divider {
    border: 0;
    height: 1px; /* Line thickness */
    background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0)); /* Gradient effect */
  }
</style>


<style scoped>
.container {
  display: flex; /* Flexbox 사용 */
}

.left-panel, .right-panel {
  flex: 1; /* 동일한 너비로 확장 */
  padding: 20px;
  border: 1px solid #ccc;
  margin: 10px;
}
</style>
