<template>
  <div class="base">
    <!-- Component1 -->
    <HelloWorld msg="BaseView.vue 파일에서 보낸 메시지"/>
    <hr class="divider"/>
    <!-- Component2 -->
    <GetComponent/> 
    <PostComponent/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import GetComponent from '@/components/GetTestComponent.vue'
import PostComponent from '@/components/PostTestComponent.vue'

export default {
  name: 'BaseView',
  components: {
    HelloWorld, GetComponent, PostComponent
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