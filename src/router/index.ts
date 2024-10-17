import { createRouter, createWebHistory } from 'vue-router'
import { useTokenStore } from '@/stores/userStore'
import { OAuthCallBack } from '@/lib/utils'
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
      beforeEnter: (to, from) => {
        const tokenStore = useTokenStore()
        if (tokenStore.tokens.access == '') return { name: 'login' }
      }
    },
    {
      path: '/reset-password',
      name: 'password-reset',
      component: () => import('@/views/ResetPassword.vue')
    },
    {
      path: '/github-oauth-callback/',
      name: 'github-oauth-callback/',
      component: () => import('@/components/Callback.vue')
    }
  ]
})

export default router
