<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12 col-sm-6 col-md-4" v-for="(newsItem, index) in paginatedNews" :key="index">
        <div class="card news-card" @click="selectNewsItem(newsItem)">
          <div class="card-body">
            <h3 class="card-title">{{ newsItem.title }}</h3>
            <h6 class="card-subtitle mb-2 text-muted">{{ newsItem.date }}</h6>
            <h6><div v-if="newsItem.keywords && newsItem.keywords.length">
              <span class="badge bg-secondary me-1"
                v-for="(keyword, kIndex) in newsItem.keywords" 
                :key="`${index}-${kIndex}`">{{ keyword }}
                <br>
              </span>
            </div></h6>
            <p class="card-text" v-if="selectedNewsItem === newsItem && isNewsViewVisible">
              {{ newsItem.description }}
            </p>
            <p class="card-text" v-else>
              {{ truncate(checkString(newsItem.description), 250) }}
            </p>
          </div>
          <div class="card-footer bg-white">
            <a :href="newsItem.url" target="_blank" class="btn btn-primary">원문 보기</a>
          </div>
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
    await this.fetchNews(); // 컴포넌트 마운트 시 뉴스 데이터 가져오기
  },
  methods: {
    checkString(value) {
      // 문자열이 아닐 경우 문자열로 변환
      return typeof value === 'string' ? value : String(value);
    },
    truncate(text, maxLength) {
      if (!text) return ''; // 비어 있는 경우 빈 문자열 반환
      if (text.length > maxLength) {
        return text.substring(0, maxLength - 3) + '...더보기'; // 초과하는 경우 축약
      }
      return text; // 조건에 맞지 않는 경우 원본 텍스트 반환
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
    // 뉴스 데이터를 API로부터 가져오는 함수
    async fetchNews() {
      const url = 'http://localhost:8080/api/news/list'; // API URL

      try {
        const token = this.getToken; // Vuex에서 토큰 가져오기

        if (!token) {
          console.error('토큰이 없습니다. 로그인하세요.');
          return;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `${token}`, // HTTP 요청 헤더에 토큰 포함
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const news_data = await response.json();

        // 응답 데이터에서 뉴스 배열이 존재하면 파싱하여 저장
        if (Array.isArray(news_data.data)) {
            this.news = news_data.data.map(item => ({
                title: item.newsTitle || '제목 없음',
                date: item.newsDate || '날짜 없음',
                description: item.newsDescription || '내용 없음',
                keywords: item.newsKeywords ? item.newsKeywords.split(',') : [],
                url: item.newsUrl || '#'
            }));

        } else {
            console.error('Data is not an array:', news_data);
            this.news = []; // 데이터가 배열이 아닐 경우 빈 배열 할당
        }

      } catch (error) {
        console.error('Failed to fetch news:', error);
      }
    },
    selectNewsItem(item) {
      if (this.selectedNewsItem === item) {
        this.isNewsViewVisible = !this.isNewsViewVisible;
      } else {
        this.selectedNewsItem = item;
        this.isNewsViewVisible = true;
      }
    }
  }
};
</script>

<style scoped>
.clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.news-card {
  background-color: #E3F2FD;
  border-radius: 10px;
  transition: transform .3s ease-in-out;
}

.news-card:hover {
  transform: scale(1.05);
}

.card-footer {
  border-top: 1px solid #ddd;
}
.card-text {
  cursor: pointer;
}
.pagination {
  display: inline-block;
}

.pagination a {
  color: black;
  float: left;
  padding: 8px 16px;
  text-decoration: none;
}
</style>