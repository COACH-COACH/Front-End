<template>
  <div>
  <div class="background-color"> 
    <div class="container news-container">
      <div class="news-main-container">
        <h2 class="news-main">{{ userData.fullName }}님이 좋아하실 만한 뉴스예요</h2>
      </div>
      <div class="news-sub-container">
        <h3 class="news-sub">업데이트된 뉴스를 확인해보세요</h3>
      </div>
    </div>
  </div>
    <CardNewsComponent :user-goals="userData.goals" :user-lifecycle="userData.lifeStage"/>

  </div>
</template>

<script>
import CardNewsComponent from '@/components/CardNewsComponent.vue';
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  components: { CardNewsComponent },
  name: 'CardNewsComponenet',
  computed: {
    ...mapGetters(['getToken']),
    filteredGoals() {
      return this.goals.filter(goal => goal.goalSt === 0);
    }
  },
  filters: {
    currencyFormat(value) {
      return `$${value.toFixed(2)}`;
    }
  },
  data() {
    return {
      showConfirmModal: false,
      goals: [],
      responseMessage: null,
      responseMessageDeactivate: null,
      currentPage: 'page1',
      userData: {
        userId: null,
        fullName: "",
        goals: []
      }
    };
  },
  mounted() {
    this.fetchGoals();
    this.fetchGoalData();
  },
  methods: {
    async fetchGoals() {
      const url = process.env.VUE_APP_API_URL + '/goal/list'
      try {
        const token = this.getToken;
        const response = await axios.get(url, { headers: { Authorization: `${token}` } });
        this.goals = response.data.data;
      } catch (error) {
        console.error('목표 조회 실패:', error);
      }
    },

    async fetchGoalData() {
      const url = process.env.VUE_APP_API_URL + '/goal/product/list';
      try {
        const token = this.getToken;
        const response = await axios.get(url, { headers: { Authorization: `${token}` } });
        this.userData = response.data.data;
      } catch (error) {
        console.error('사용자 목표 조회 중 오류 발생:', error);
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR');
    }
  } // methods 객체를 닫는 괄호 추가
}; // export default를 닫는 괄호 추가
</script>


<style scoped>
.background-color{
  background-color: #EAF5FD;
}
.news-container {
  display: flex;
  text-align: center;
  width: 100%;
  height: 250px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.news-main {
  text-align: left;
  color: #0262AC;
}

.news-main-container {
  text-align: left;
  display: block;
  width: 100%;
  height: auto;
}

.news-sub-container {
  text-align: left;
  display: block;
  width: 100%;
  height: auto;
}


.news-sub {
  color: #6B6B6B;
  text-align: left;
}
</style>