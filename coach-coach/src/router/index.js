import { createRouter, createWebHistory } from 'vue-router'
import BaseView from '@/views/BaseView.vue'
import ProductView from '@/views/ProductView.vue'
import GoalView from '@/views/GoalView.vue'
import MypageView from '@/views/MyPageView.vue'

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
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
