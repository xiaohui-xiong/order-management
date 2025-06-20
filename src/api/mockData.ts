import { md5 } from '../utils/crypto'

// 订单状态枚举
export type OrderStatus = 'pending' | 'shipped' | 'completed' | 'cancelled'

// 订单接口
export interface Order {
	id: string
	status: OrderStatus
	orderTime: string
	amount: number
	user: {
		id: string
		phone: string
		name: string
	}
	deliveryTime?: string
	items: Array<{
		name: string
		price: number
		quantity: number
	}>
}
// 用户登录接口
interface User {
	username: string
	password: string
}

interface ApiResponse {
	ret: number
	iRet: number
	sMsg: string
	sAmsSerial: string
	fReqUseTime: number
	data?: any // 实际业务数据
}

//接口固定格式
const format: ApiResponse = {
	ret: 0,
	iRet: 0,
	sMsg: 'ok',
	sAmsSerial: 'AMS-DAFENG-1112153748-c7Ha1N-681356-344250',
	fReqUseTime: 0.0638,
}
// 储存用户数据
const userList: User[] = [
	{
		username: 'admin',
		password: md5('admin123'),
	},
	{
		username: 'user',
		password: md5('user123'),
	},
]

// 生成模拟订单数据
const generateOrders = (count: number): Order[] => {
	const statuses: OrderStatus[] = [
		'pending',
		'shipped',
		'completed',
		'cancelled',
	]
	const products = [
		{ name: 'iPhone 15', price: 8999 },
		{ name: 'MacBook Pro', price: 12999 },
		{ name: 'AirPods Pro', price: 1999 },
		{ name: 'iPad Air', price: 5999 },
		{ name: 'Apple Watch', price: 3299 },
	]

	const orders: Order[] = []

	for (let i = 1; i <= count; i++) {
		const orderDate = new Date(
			Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
		)
		const deliveryDate = new Date(orderDate.getTime() + 2 * 24 * 60 * 60 * 1000)

		const itemCount = Math.floor(Math.random() * 3) + 1
		const orderItems = []
		let totalAmount = 0

		for (let j = 0; j < itemCount; j++) {
			const product = products[Math.floor(Math.random() * products.length)]
			const quantity = Math.floor(Math.random() * 2) + 1
			totalAmount += product.price * quantity
			orderItems.push({ ...product, quantity })
		}

		orders.push({
			id: `ORD${10000 + i}`,
			status: statuses[Math.floor(Math.random() * statuses.length)],
			orderTime: orderDate.toISOString(),
			amount: totalAmount,
			deliveryTime: deliveryDate.toISOString(),
			user: {
				id: `USER${20000 + i}`,
				phone: `13${Math.floor(Math.random() * 1000000000)
					.toString()
					.padStart(9, '0')}`,
				name: `用户${i}`,
			},
			items: orderItems,
		})
	}
	return orders
}

// mock数据
export const mockData = {
	//用户登录
	Login: (account: User) => {
		const data = {
			iRet: 0,
			sMsg: 'ok',
		}
		const matched = userList.find(
			(c: User) =>
				c.username === account.username && c.password === account.password
		)
		if (matched) {
		} else {
			data.iRet = 1
			data.sMsg = '用户名或密码错误'
		}
		console.log()
		return {
			...format,
			...data,
		}
	},
}

export const orders = generateOrders(35)
