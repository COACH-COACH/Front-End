<template>
  <div>
    <h1>소비탭입니다!!!!!!!!!!</h1>
    <div v-if="loading">
      <p>로딩 중...</p>
    </div>
    <div v-else>
      <div v-if="adminResponse">
        <h2>당신의 다음 분기 소비량 예측:</h2>
        <p>{{ adminResponse }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['getToken']) // Vuex의 getToken getter를 컴포넌트 내에서 사용 가능하게 등록
  },
  data() {
    return {
      loading: false, // 로딩 상태를 추적하는 데이터
      adminResponse: null
    };
  },
  mounted() {
    this.accessAdminPage(); // 페이지 로드 시 Admin 페이지 접속 기능 자동 실행
  },
  methods: {
    async accessAdminPage() {
      this.loading = true; // 로딩 상태 시작

      const url = 'http://localhost:8080/user/invoke-flask';

      try {
        const token = this.getToken; // Vuex 스토어에서 토큰 가져오기

        if (!token) {
          console.error('토큰이 없습니다. 로그인 후 다시 시도해주세요.');
          return;
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `${token}`, // HTTP 요청 헤더에 토큰 포함
          }
        });

        this.adminResponse = response.data; // Admin 페이지 응답 저장
      } catch (error) {
        console.error('Admin 페이지 접속 실패:', error);
      } finally {
        this.loading = false; // 로딩 상태 종료
      }
    }
  }
};
</script>
