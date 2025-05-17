import { verify } from '@/lib/utils'
import { createRouter, createWebHistory } from 'vue-router'
import Storage from '@/views/Storage.vue'

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
      name: 'fileManager',
      component: () => import('@/views/FileManager.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          component: Storage,
          meta: { requiresAuth: true }
        }
      ]
    },
    {
      path: '/reset-password',
      name: 'password-reset',
      component: () => import('@/views/ResetPassword.vue')
    }
    //{
    //  path: '/greet',
    //  name: 'greet-user',
    //  component: () => import('@/components/ShowTag.vue')
    //}
  ]
})

router.beforeEach(async (to, from) => {
  if (to.meta.requiresAuth) {
    const authorized = await verify()

    if (!authorized) {
      return {
        name: 'login',
        query: { redirect: to.fullPath }
      }
    }
  }
})

export default router
