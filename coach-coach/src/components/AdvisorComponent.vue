<template>
  <div class="from-me">
    <div class="message-bubble" v-if="!isLoading" v-html="formattedMessage">
    </div>
    <div v-else class="loading-spinner">
      Loading...
    </div>
    <div class="navigation-buttons">
      <button @click="handlePrev">&#x25C0;</button>
      <button @click="handleNext">&#x25B6;</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['getToken']),
     formattedMessage() {
      if (this.messages.length > 0 && this.currentView < this.messages.length) {
        return this.formatNews(this.messages[this.currentView]);
      }
      return '';  // 인덱스가 범위 밖이면 공백 출력
    }
  },
  data() {
    return {
      isLoading: true,
      currentView: 0,
      messages: [],
    };
  },
  methods: {
    // 이전, 다음 뉴스 버튼
    handleNext() {
      this.currentView = (this.currentView + 1) % this.messages.length;
    },
    handlePrev() {
      this.currentView = (this.currentView + this.messages.length - 1) % this.messages.length;
    },
    // 어드바이저 API 연결
    async fetchAdvice() {
      const url = 'http://localhost:8080/advisor/getAdvice';
      const token = this.getToken;
      const headers = new Headers({
        'Authorization': `${token}`,
        'Accept': 'application/json'
      });

      try {
        const response = await fetch(url, { method: 'GET', headers: headers });
        if (!response.ok) {
          throw new Error(`Network response was not ok ${response.statusText}`);
        }
        const data = await response.json();
        this.messages = [
          this.formatNews(data.customNews),
          this.formatNews(data.goalCheer),
          this.formatNews(data.consumptionCheer)
        ];
        this.isLoading = false;
      } catch (error) {
        console.error('메시지 Fetch 시 오류 발생:', error);
        this.messages = ['에러가 발생했어요. 조금 더 나은 위비코치가 되도록 개선할게요!'];
        this.isLoading = false;
      }
    },

    // API로 받아온 텍스트 정제
    formatNews(text) {
      const sentences = text.split(/(?<=[.!?])\s+/);
      if (sentences.length > 0) {
        sentences[0] = `<h2>${sentences[0]}</h2>`;
      }
      return sentences.join('\n');
    }
  },
  created() {
    this.fetchAdvice();
  }
};
</script>


<style scoped>

button {
  margin: 5px;
  padding: 10px 20px;
  color: white;
  background-color: transparent;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
    color: gray;
}
body {
  font-family: "Helvetica Neue";
  font-size: 20px;
  font-weight: normal;
}

section {
  max-width: 450px;
  margin: 50px auto;
}
section div {
  max-width: 255px;
  word-wrap: break-word;
  margin-bottom: 20px;
  line-height: 24px;
}

.clear {
  clear: both;
}

.from-me {
  position: relative;
  padding: 10px 20px;
  color: white;
  background: #0B93F6;
  border-radius: 25px;
  float: right;
}
.from-me:before {
  content: "";
  position: absolute;
  z-index: -1;
  bottom: -2px;
  right: -7px;
  height: 20px;
  border-right: 20px solid #0B93F6;
  border-bottom-left-radius: 16px 14px;
  -webkit-transform: translate(0, -2px);
}
.from-me:after {
  content: "";
  position: absolute;
  z-index: 1;
  bottom: -2px;
  right: -56px;
  width: 26px;
  height: 20px;
  background: white;
  border-bottom-left-radius: 10px;
  -webkit-transform: translate(-30px, -2px);
}

.loading-spinner {
  text-align: center;
  font-size: 20px;
  color: #FFF;
}
</style>
