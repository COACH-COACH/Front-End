<template>
  <div>
    <div class="header">
      <div class="container">
        <router-link to="/main" class="logo"><i>WIBEE</i> COACH</router-link>
        <nav class="navigation">
          <ul>
            <li><router-link to="/main/goal">목표 관리</router-link></li>
            <li><router-link to="/main/consumption">소비 관리</router-link></li>
            <li><router-link to="/main/product">금융 상품</router-link></li>
            <li><router-link to="/main/news">추천 뉴스</router-link></li>
          </ul>
        </nav>
        <div class="user-actions">
          <template v-if="isLoggedIn">
            <router-link to="/main/mypage">알림</router-link>
            <router-link to="/main/mypage">마이페이지</router-link>
            <router-link to="/main" @click="logout">로그아웃</router-link>
          </template>
          <template v-else>
            <router-link to="/main/signup">회원가입</router-link>
            <router-link to="/main/signin">로그인</router-link>
          </template>
        </div>
      </div>
    </div>
    <router-view/>
  </div>
  
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'HeaderComponent',
  setup() {
    const store = useStore();
    const isLoggedIn = computed(() => !!store.getters.getToken);

    const logout = () => {
      store.dispatch('logout');
    };

    return {
      isLoggedIn, logout
    };
  }
}
</script>

<style>
.header {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #0262AC;
  text-decoration-line: none;
  font-family: 'dohyeon';
}

.navigation ul {
  list-style: none;
  display: flex;
  padding: 0;
  margin: 0;
}

.navigation li {
  margin: 0 1rem;
}

.navigation li a {
  color: #333;
  text-decoration: none;
  font-size: 1rem;
}

.user-actions {
  display: flex;
}

.user-actions a {
  margin-left: 1rem;
  color: #6a6a6a;
  text-decoration: none;
}

.logout-link {
  color: #e74c3c;
}
</style>