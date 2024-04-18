import { createRouter, createWebHistory } from 'vue-router'
import BaseView from '@/views/BaseView.vue'
import ProductView from '@/views/ProductView.vue'
import GoalView from '@/views/GoalView.vue'
import MypageView from '@/views/MyPageView.vue'
import SignUpView from '@/views/SignUpView.vue'
import SignInView from '@/views/SignInView.vue'
import TokenStoringTestView from '@/views/TokenStoringTestView.vue'
import ConsumptionView from '@/views/ConsumptionView.vue'
import ProductDetailView from '@/views/ProductDetailView.vue'

const routes = [
  {
    path: '/main',
    name: 'base',
    component: BaseView
  },
  {
    path: '/main/product',
    name: 'product',
    component: ProductView
  },
  {
    path: '/main/goal',
    name: 'goal',
    component: GoalView
  },
  {
    path: '/main/mypage',
    name: 'mypage',
    component: MypageView
  },
  {
    path: '/main/signup',
    name: 'signup',
    component: SignUpView
  },
  {
    path: '/main/signin',
    name: 'signin',
    component: SignInView
  },
  {
    path: '/main/test',
    name: 'admin',
    component: TokenStoringTestView
  },
  {
    path: '/main/consumption',
    name: 'consumption',
    component: ConsumptionView,
    meta: { requiresAuth: true } // 인증이 필요한 페이지로 설정
  },
  {
    path: '/main/product/detail/:pid',
    name: 'productdetail',
    component: ProductDetailView,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 네비게이션 가드 설정
router.beforeEach((to, from, next) => {
  // requiresAuth 메타 필드가 true인 페이지에 접근할 때
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const isAuthenticated = checkUserAuthentication(); // 사용자 인증 상태 확인 (예시)
    if (!isAuthenticated) {
      // 인증되지 않은 사용자는 안내 문구 표시 후 리다이렉트
      showUnauthorizedMessage(next);
    } else {
      // 인증된 사용자는 페이지로 진입
      next();
    }
  } else {
    // requiresAuth 메타 필드가 없거나 false인 페이지는 자유롭게 진입
    next();
  }
});

// 사용자 인증 상태 확인 함수 (예시)
function checkUserAuthentication() {
  const token = sessionStorage.getItem('token');
  return !!token; // 토큰이 존재하면 인증된 것으로 간주
}

// 인증 실패 시 안내 메시지 표시 및 리다이렉트 처리
function showUnauthorizedMessage(next) {
  const unauthorizedMessage = '로그인이 필요합니다. 로그인 페이지로 이동합니다.';
  alert(unauthorizedMessage);

  // 일정 시간이 지난 후 리다이렉트
  setTimeout(() => {
    next({ name: 'signin' });
  }, 4000); // 4초 후 리다이렉트
}

export default router
