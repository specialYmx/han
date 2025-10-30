import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/salary-calculator'
  },
  {
    path: '/salary-calculator',
    name: 'SalaryCalculator',
    component: () => import('@/views/SalaryCalculator.vue'),
    meta: {
      title: '薪资计算'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - 工资计算器`
  }
  next()
})

export default router
