import { createRouter, createWebHistory } from 'vue-router'
import BaseView from '@/views/BaseView.vue'
import ProductView from '@/views/ProductView.vue'
import GoalView from '@/views/GoalView.vue'
import MypageView from '@/views/MyPageView.vue'
import SignUpView from '@/views/SignUpView.vue'
import SignInView from '@/views/SignInView.vue'
import TokenStoringTestView from '@/views/TokenStoringTestView.vue'

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
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
