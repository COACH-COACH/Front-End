<template>
  <div>
    <h2>Time Series Prediction 컴포넌트</h2>
    <div v-if="flaskResponse">
      <p>Flask 서버로부터 받은 응답:</p>
      <pre>{{ flaskResponse }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    flaskResponse: {
      type: Object,
      default: null
    }
  }
};
</script>
