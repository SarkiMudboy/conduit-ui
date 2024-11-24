import { verify } from '@/lib/utils'
import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginPage.vue')
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: () => import('@/views/SignUp.vue')
    },
    {
      path: '/files',
      name: 'storage',
      component: () => import('@/views/Storage.vue'),
      beforeEnter: async (to, from) => {
        await verify().then((authorized) => {
          if (!authorized) return { name: 'login' }
        })
      }
    },
    {
      path: '/reset-password',
      name: 'password-reset',
      component: () => import('@/views/ResetPassword.vue')
    }
  ]
})

export default router
