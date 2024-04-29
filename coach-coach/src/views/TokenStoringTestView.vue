<template>
  <div>
    <h1>Admin 페이지 접속 테스트</h1>
    <button @click="accessAdminPage">Admin 페이지 접속하기</button>
    <div v-if="adminResponse">
      <h2>Admin 페이지 응답:</h2>
      <p>{{ adminResponse }}</p>
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
      adminResponse: null
    };
  },
  methods: {
    async accessAdminPage() {
      const url = process.env.VUE_APP_API_URL + '/admin';

      try {
        const token = this.getToken; // Vuex 스토어에서 토큰 가져오기

        if (!token) {
          console.error('토큰이 없습니다. 로그인 후 다시 시도해주세요.');
          return;
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `${token}` // HTTP 요청 헤더에 토큰 포함
          }
        });

        this.adminResponse = response.data; // Admin 페이지 응답 저장
      } catch (error) {
        console.error('Admin 페이지 접속 실패:', error);
      }
    }
  }
};
</script>
