import type { Order } from './../type/order.types'
import { md5 } from '@/utils/crypto'
import generateOrders from '../../mock/index'
import type { User } from '@/type/user.types'

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

let orderData: Order[] = []

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
		return {
			...format,
			...data,
		}
	},
	getOrders: () => {
		if (orderData.length === 0) {
			orderData = generateOrders()
		} else {
		}
		return {
			...format,
			data: orderData,
		}
	},
}
