<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12 col-sm-6 col-md-4" v-for="(newsItem, index) in paginatedNews" :key="index">
        <div class="card news-card" @click="selectNewsItem(newsItem)">
          <div class="card-image">
            <img :src="newsItem.img" alt="news-image" class="card-img-top">
          </div>
          <div class="card-body">
            <h3 class="card-title">{{ newsItem.title }}</h3>
            <h6 class="card-subtitle mb-2 text-muted">{{ newsItem.date }}</h6>
            <div v-if="newsItem.keywords && newsItem.keywords.length" class="keyword-wrapper">
              <span class="badge bg-info me-1"
                v-for="(keyword, kIndex) in newsItem.keywords" 
                :key="`${index}-${kIndex}`">#{{ keyword }}</span>
            </div>
            <p class="card-text">
              {{ formatText(truncate(checkString(newsItem.description)), 250) }}
            </p>
          </div>
          <button class="btn-primary" @click="openLink(newsItem.url)">
            원문 보기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    // Vuex store에서 토큰 가져오기
    ...mapGetters(['getToken']),
    // 총 페이지 수 계산 (현재는 사용되지 않음)
    // totalPages() {
    //   return Math.ceil(this.news.length / this.perPage);
    // },

    // 현재 페이지의 뉴스 데이터를 계산
    paginatedNews() {
      const start = (this.page - 1) * this.perPage;
      const end = start + this.perPage;
      return this.news.slice(start, end);
    },
  },  
  data() {
    return {
      news: [], // 뉴스 데이터를 저장하는 배열
      page: 1, // 현재 페이지 번호
      perPage: 5, // 페이지당 표시할 뉴스 수
      selectedNewsItem: null, // 선택된 뉴스 아이템
      isNewsViewVisible: false, // 뉴스 상세보기의 표시 여부
    };
  },
  async mounted() {
  await this.fetchNews();  // 뉴스 데이터 가져오기 
  },
  methods: {
    // 문자열이 아닐 경우 문자열로 변환
    checkString(value) {
      return typeof value === 'string' ? value : String(value);
    },
    // 뉴스 3줄 이후 더보기 처리하는 함수
    truncate(text, maxLength) {
      if (!text) return '';
      if (text.length > maxLength) {
        return text.substring(0, maxLength - 3) + '...더보기'; // 초과하는 경우 축약
      }
      return text;
    },
    // 선택된 뉴스의 상세내용을 보여주는 함수
    toggleDescription(index) {
      this.news = this.news.map((item, i) => {
        if (i === index) {
          return { ...item, expanded: !item.expanded }; // 현재 아이템 토글
        }
        return { ...item, expanded: false }; // 나머지는 닫기
      });
    },
    // \n을 <br>로 변환해주는 함수
    formatText(text) {
      return text.replace(/\n/g, '<br>');
    },
    // 뉴스 API 가져오기
    async fetchNews() {
      const url = process.env.VUE_APP_API_URL + '/news/list';
      try {
        const token = this.getToken;
        if (!token) {
          console.error('로그인하세요.');
          return;
        }
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json'
            },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const news_data = await response.json();
        if (Array.isArray(news_data.data)) {
            this.news = news_data.data.map(item => ({
                title: item.newsTitle || '제목이 없어요.',
                date: item.newsDate || '날짜가 없어요.',
                description: item.newsDescription || '내용이 없어요.',
                keywords: item.newsKeywords ? item.newsKeywords.split(',') : [],
                url: item.newsUrl || '#',
                img: item.newsImg || '#' 
            }));
        } else {
            console.error('데이터가 배열 형태가 아닙니다', news_data);
            this.news = [];
        }
      } catch (error) {
        console.error('뉴스를 가져오는 과정에서 에러가 발생했습니다.:', error);
      }
    },
    selectNewsItem(item) {
      this.selectedNewsItem = item;
      this.isNewsViewVisible = !this.isNewsViewVisible;
    },
    // 새 탭에서 URL 열기
    openLink(url) {
      window.open(url, '_blank'); 
    },
  }
};
</script>

<style scoped>
.news-card {
  background-color: #ffffff;
  border: 1px solid #0083CA;
  border-radius: 12px;
  margin: 20px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  color: #333;
}

.news-card:hover {
  transform: translateY(-5px);
  border-color: #0083CA;
}

.card-footer {
  border-top: 1px solid #0067AC;
}

.card-title {
  color: #0067AC;
  font-size: 18px;
}

.card-text {
  font-size: 16px;
  line-height: 1.6;
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
  background-color: #FFFFFF;
  border-radius: 10px;
  padding: 5px 10px;
  margin: 0 5px 5px 0;
  display: inline-block;
}

.btn-primary:hover {
  background-color: #0083CA;
}
.card-image {

}
.card-img-top {
  width: 100%;
  height: auto;
  border-radius: 12px 12px 0 0;
}

.keyword-wrapper {
  margin-bottom: 10px;
}
</style>
