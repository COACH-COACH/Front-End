<template>
  <div>
    <div class="header">
      <div class="container">
        <router-link to="/main" class="logo"><i>WIBEE COACH</i></router-link>
        <nav class="navigation">
          <ul>
            <li><router-link to="/main/goal">목표 관리</router-link></li>
            <!-- <li><router-link to="/main/payment">소비 관리</router-link></li> -->
            <li><router-link to="/main/consumption">소비 관리</router-link></li>
            <li><router-link to="/main/product">금융 상품</router-link></li>
            <li><router-link to="/main/news">추천 뉴스</router-link></li>
          </ul>
        </nav>
        <div class="user-actions">
          <router-link to="/main/mypage">마이페이지</router-link>
          <router-link to="/main/signup">회원가입</router-link>
          <router-link to="/main/signin">로그인</router-link>
          <!-- <router-link to="/main/test">토큰저장되나</router-link> -->
          <!-- <router-link to="/main/consumption">소비탭</router-link> -->
          <!-- <router-link to="/logout" class="logout-link">로그아웃</router-link> -->
        </div>
      </div>
    </div>
    <router-view/>
  </div>
  
</template>


<style>
.header {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #FEE101;
  text-decoration-line: none;
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
  color: #333;
  text-decoration: none;
}

.logout-link {
  color: #e74c3c;
}
</style>