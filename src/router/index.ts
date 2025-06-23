import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		redirect: '/orders',
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import('@/view/Login.vue'),
	},
	{
		path: '/orders',
		name: 'OrderList',
		component: () => import('@/view/order/OrderList.vue'),
		meta: { requiresAuth: true },
	},
	{
		path: '/orders/:id',
		name: 'OrderDetail',
		component: () => import('@/view/order/OrderDetail.vue'),
		meta: { requiresAuth: true },
		props: true,
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
	const authStore = useAuthStore()
	if (to.meta.requiresAuth && !authStore.isAuthenticated) {
		next('/login')
	} else {
		next()
	}
})

export default router
