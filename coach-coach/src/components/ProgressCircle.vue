<template>
    <svg width="100" height="100" viewBox="0 0 36 36" class="circular-chart">
      <path class="circle-bg"
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        stroke="#eeeeee"
        stroke-width="2.8"
      />
      <path class="circle"
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        :stroke="progressColor"
        stroke-width="2.8"
        :stroke-dasharray="circumference + ' ' + circumference"
        :style="{ strokeDashoffset: offset }"
      />
    </svg>
  </template>
  
  <script>
  export default {
    name: 'ProgressCircle',
    props: {
      percentage: {
        type: Number,
        required: true
      }
    },
    computed: {
      circumference() {
        return 2 * Math.PI * 15.9155;
      },
      offset() {
        return ((100 - this.percentage) / 100) * this.circumference;
      },
      progressColor() {
        return this.percentage >= 50 ? '#4CAF50' : '#FFC107';
      }
    }
  };
  </script>
  
  <style scoped>
  .circular-chart {
    display: block;
    margin: 10px auto;
    max-width: 80%;
    max-height: 250px;
  }
  .circle-bg {
    fill: none;
    stroke: #eee;
    stroke-width: 3.8;
  }
  .circle {
    fill: none;
    stroke-linecap: round;
    animation: progress 1s ease-out forwards;
  }
  </style>
  