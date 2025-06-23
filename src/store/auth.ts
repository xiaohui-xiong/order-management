import { defineStore } from 'pinia'
import { mockData } from '@/api/mockData'
import router from '@/router'

interface User {
	id: number
	username: string
}

export const useAuthStore = defineStore('auth', {
	state: () => ({
		user: null as User | null,
		token: localStorage.getItem('token') || null,
	}),

	getters: {
		isAuthenticated: (state) => !!state.token,
	},

	actions: {
		login(username: string, password: string) {
			// 模拟登录逻辑
			return new Promise<void>(async (resolve, reject) => {
				const data = await mockData.Login({ username, password })
				if (data.iRet === 0) {
					this.token = 'fake_jwt_token'
					this.user = { id: 1, username }
					localStorage.setItem('token', this.token)
					router.push('/orders')
					resolve()
				} else {
					reject(new Error(data.sMsg))
				}
			})
		},
		logout() {
			this.token = null
			this.user = null
			localStorage.removeItem('token')
			router.push('/login')
		},
	},
})
