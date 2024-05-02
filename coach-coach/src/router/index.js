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
import CardNewsView from '@/views/CardNewsView.vue'
import CreateGoalView from '@/views/CreateGoalView.vue'
import CreatePlanView from '@/views/CreatePlanView.vue'
import store from '@/store';

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
    path: '/main/goal/new',
    name: 'newGoal',
    component: CreateGoalView
  },
  {
    path: '/main/mypage',
    name: 'mypage',
    component: MypageView,
    meta: { requiresAuth: true }
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
  },
  {
    path: '/main/news',
    name: 'cardnews',
    component: CardNewsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/main/goal/plan/new/:enrollId',
    name: 'newPlan',
    component: CreatePlanView,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 전역 네비게이션 가드
router.beforeEach((to, from, next) => {
  const publicPages = ['/main/signin', '/main', '/main/signup']; // 로그인이 필요없는 페이지 경로
  const authRequired = !publicPages.includes(to.path); // 인증이 필요한 페이지인지 확인
  const loggedIn = store.getters.getToken; // 로그인 상태(토큰 유무)

  if (authRequired && !loggedIn) {
    next('/main/signin'); // 인증이 필요하고 로그인이 되어 있지 않다면 로그인 페이지로 리다이렉트
  } else {
    next(); // 그 외의 경우 정상적으로 라우트 진행
  }
});

export default router
