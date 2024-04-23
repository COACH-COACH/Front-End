<template>
  <div>
    <h3>고객님의 생애주기와 목표를 종합한 뉴스들이에요</h3>
    <CardNewsComponent/>
  </div>
</template>

<script>
import CardNewsComponent from '@/components/CardNewsComponent.vue';
export default {
  components: { CardNewsComponent },
  name: 'CardNewsComponenet',
};
</script>
