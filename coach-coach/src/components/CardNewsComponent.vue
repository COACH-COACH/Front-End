<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <div class="button-container">
          <button class="btn btn-primary mx-2" 
                  :class="{ active: selectedGoal === '전체' }"
                  @click="filterNews('전체')">전체</button>
          <button class="btn btn-primary mx-2" v-for="goal in goals" :key="goal.goalName"
                  :class="{ active: selectedGoal === goal.goalName }"
                  @click="filterNews(goal.goalName)">{{ goal.goalName }}</button>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-md-4" v-for="(newsItem, index) in paginatedNews" :key="index">
        <div class="card news-card" @click="selectNewsItem(newsItem)">
          <div class="card-image" @mouseover="hover = true" @mouseleave="hover = false">
            <img :src="newsItem.img" @error="imageError" alt="news image" class="card-img-top">
            <button class="btn btn-secondary view-original" v-if="hover" @click.stop="openLink(newsItem.url)">
              원문 보러 가기
            </button>
          </div>
          <div class="card-body">
            <h5 class="card-title">{{ newsItem.title }}</h5>
            <p class="card-subtitle mb-2 text-muted">{{ newsItem.date }}</p>
            <p class="card-text">{{ truncate(newsItem.description, 100) }}</p>
          </div>
        </div>
      </div>
        <div class="pagination">
          <button @click="changePage(-1)" :disabled="page === 1">Previous</button>
          <button @click="changePage(1)" :disabled="page * perPage >= filteredNews.length">Next</button>
        </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
  props: ['userGoals'],
  computed: {
    ...mapGetters(['getToken']),
    paginatedNews() {
      const start = (this.page - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredNews.slice(start, end);
    },
    filteredNews() {
      if (this.selectedGoal === '전체') {
        return this.news;
      } else {
        return this.news.filter(item => item.keywords.includes(this.selectedGoal));
      }
    }
  },
  data() {
    return {
      hover: false,
      news: [],
      filteredNews: [],
      page: 1,
      perPage: 6,
      selectedNewsItem: null,
      isNewsViewVisible: false,
      goals: [],
      selectedGoal: "전체",
      lifeStage: "",
      defaultImage: "https://ifh.cc/g/x8Xt21.jpg"
    };
  },
  async mounted() {
    await this.fetchNews();
    await this.fetchGoals();
  },
  methods: {
    imageError(event) {
      event.target.src = this.defaultImage;
    },
    changePage(direction) {
      this.page += direction;
    },
    equalizeHeights() {
      this.$nextTick(() => {
        const cards = Array.from(document.querySelectorAll('.news-card'));
        const maxHeight = Math.max(...cards.map(card => card.offsetHeight));
        cards.forEach(card => card.style.height = `${maxHeight}px`);
      });
    },
    async fetchNews() {
      const url = process.env.VUE_APP_API_URL + '/news/list';
      try {
        const token = this.getToken;
        const response = await axios.get(url, {
          headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json'
          },
        });
        if (response.data && Array.isArray(response.data.data)) {
          this.news = response.data.data.map(item => ({
            title: item.newsTitle || '제목이 없어요.',
            date: item.newsDate || '날짜가 없어요.',
            description: item.newsDescription || '내용이 없어요.',
            keywords: item.newsKeywords ? item.newsKeywords.split(',') : [],
            url: item.newsUrl || '#',
            img: item.newsImg || '#' 
          }));
          this.filterNews(this.selectedGoal); // Initial filter upon data fetch
        }
      } catch (error) {
        console.error('뉴스를 가져오는 과정에서 에러가 발생했습니다.:', error);
      }
    },
    async fetchGoals() {
      const url = process.env.VUE_APP_API_URL + '/goal/list';
      try {
        const token = this.getToken;
        const response = await axios.get(url, {
          headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json'
          },
        });
        if (response.data && Array.isArray(response.data.data)) {
          this.goals = response.data.data;
        }
      } catch (error) {
        console.error('목표 데이터를 가져오는 과정에서 에러가 발생했습니다.:', error);
      }
    },
    filterNews(goalName) {
      this.selectedGoal = goalName;
      if (goalName === '전체') {
        this.filteredNews = this.news;
      } else {
        this.filteredNews = this.news.filter(item =>
          item.keywords.some(keyword => {
            // '-' 기호를 기준으로 문자열을 분리하고 두 번째 부분을 가져옴
            const goalPart = keyword.split('-')[1]?.trim().toLowerCase();
            return goalPart === goalName.toLowerCase();
          })
        );
      }
    },
    selectNewsItem(item) {
      this.selectedNewsItem = item;
      this.isNewsViewVisible = !this.isNewsViewVisible;
    },
    openLink(url) {
      window.open(url, '_blank');
    },
    truncate(text, maxLength) {
      if (text.length > maxLength) {
        return text.substring(0, maxLength - 3) + '...더보기';
      }
      return text;
    },
  }
};
</script>

<style scoped>
.button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.btn-primary.active, .btn-primary:active {
  background-color: #0083CA;
  color: #FFFFFF;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}

.news-card-container {
  margin-bottom: 20px;
}

.news-card {
  background-color: #f5f5f5;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}


@media (max-width: 768px) {
  .cards-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .cards-container {
    grid-template-columns: 1fr;
  }
}

.btn-secondary, .btn-secondary:active {
  background-color: transparent;
  border-radius: 5px;
  border-color: #FFFFFF;
  color: #FFFFFF;
}

.news-card {
  width: calc(33.333% - 40px); /* Adjusts card width to fit 3 per row */
  margin: 10px;
  float: left;
  background-color: #f5f5f5;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  color: #333;
  height: 450px;
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.view-original {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: none;
  z-index: 10;
}
.card-img-top {
  width: 100%; 
  height: 100%;
  object-fit: cover;
}
.card-image:hover .card-img-top {
  filter: brightness(50%);

}

.card-image:hover .view-original {
  display: block;
}



.news-card:hover {
  transform: translateY(-5px);
  border-color: #0083CA;
}


.card-title {
  color: #6b6b6b;
  font-size: 18px;
  margin: 10px;
}

.card-text {
  font-size: 16px;
  line-height: 1.6;
  color: #6b6b6b;
  margin: 15px;
}

.badge {
  background-color: #20C4F4;
  color: #FFFFFF;
  border-radius: 10px;
  padding: 5px 10px;
  margin: 0 5px 5px 0;
  display: inline-block;
}

.btn-primary {
  background-color: #F5F5F5;
  border-radius: 10px;
  border-color: transparent;
  padding: 5px 10px;
  margin: 0 10px 10px 0;
  display: inline-block;
}

.btn-primary:hover {
  background-color: #0083CA;
}

.btn-primary:active {
  background-color: #0083CA;
}

.card-subtitle{
  color: #9d9d9d;
  margin: 10px;
}

.col-12 {
  margin-top: 20px;
}
.card-img-top {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 12px 12px 0 0;
}

.keyword-wrapper {
  margin-bottom: 10px;
}
</style>
