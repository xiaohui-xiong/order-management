// 生成2300条订单数据

import type { Order, OrderItem } from '../src/type/order.types'
import { OrderStatus } from '../src/enums/order-status.enum'
import { el } from 'element-plus/es/locales.mjs'

// 生成随机中文姓名
function generateChineseName() {
	const surnames = [
		'王',
		'李',
		'张',
		'刘',
		'陈',
		'杨',
		'赵',
		'黄',
		'周',
		'吴',
		'熊',
	]
	const nameChars = [
		'伟',
		'芳',
		'娜',
		'秀英',
		'敏',
		'静',
		'丽',
		'强',
		'磊',
		'洋',
		'艳',
		'勇',
		'军',
		'杰',
		'娟',
		'涛',
		'明',
		'超',
		'秀兰',
		'霞',
		'平',
		'刚',
		'桂英',
		'辉',
		'宁',
		'建华',
		'文',
		'玉兰',
		'东',
		'丹',
		'小辉',
	]

	const surname = surnames[Math.floor(Math.random() * surnames.length)]
	const givenName =
		nameChars[Math.floor(Math.random() * nameChars.length)] +
		(Math.random() > 0.5
			? nameChars[Math.floor(Math.random() * nameChars.length)]
			: '')
	return surname + givenName
}

// 生成随机手机号
function generatePhoneNumber() {
	const prefixes = [
		'130',
		'131',
		'132',
		'133',
		'134',
		'135',
		'136',
		'137',
		'138',
		'139',
		'150',
		'151',
		'152',
		'153',
		'155',
		'156',
		'157',
		'158',
		'159',
		'166',
		'170',
		'171',
		'175',
		'176',
		'177',
		'178',
		'180',
		'181',
		'182',
		'183',
		'184',
		'185',
		'186',
		'187',
		'188',
		'189',
		'191',
		'198',
		'199',
	]
	const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
	let suffix = ''
	for (let i = 0; i < 8; i++) {
		suffix += Math.floor(Math.random() * 10)
	}
	return prefix + suffix
}

// 生成随机商品
function generateProduct() {
	const products = [
		'iPhone 15 Pro',
		'华为Mate 60',
		'小米13 Ultra',
		'OPPO Find X6',
		'vivo X90',
		'三星Galaxy S23',
		'荣耀Magic5',
		'iPad Pro',
		'MacBook Pro 16"',
		'戴尔XPS 15',
		'华硕ROG',
		'外星人M18',
		'索尼PlayStation 5',
		'微软Xbox Series X',
		'任天堂Switch OLED',
		'佳能EOS R6',
		'尼康Z7 II',
		'大疆Mavic 3',
		'GoPro Hero 11',
		'Kindle Paperwhite',
		'哈曼卡顿音箱',
		'Apple Watch Ultra',
	]

	return products[Math.floor(Math.random() * products.length)]
}

// 生成订单项
function generateOrderItems() {
	const itemCount = Math.floor(Math.random() * 3) + 1 // 1-3个商品
	const items: OrderItem[] = []

	for (let i = 0; i < itemCount; i++) {
		items.push({
			name: generateProduct(),
			price: Math.floor(100 + Math.random() * 9900), // 100-9999元
			quantity: Math.floor(Math.random() * 2) + 1, // 1-2件
		})
	}

	return items
}

// 计算订单总金额
function calculateTotalAmount(items) {
	return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

// 生成随机日期（过去365天内）
function generateRandomDate() {
	const now = new Date()
	const daysAgo = Math.floor(Math.random() * 365)
	const hoursAgo = Math.floor(Math.random() * 24)
	const minutesAgo = Math.floor(Math.random() * 60)

	const date = new Date(now)
	date.setDate(date.getDate() - daysAgo)
	date.setHours(date.getHours() - hoursAgo)
	date.setMinutes(date.getMinutes() - minutesAgo)

	return date.toISOString()
}

// 生成预计送达时间（基于下单时间）
function generateDeliveryTime(orderTime) {
	const date = new Date(orderTime)
	date.setDate(date.getDate() + 2 + Math.floor(Math.random() * 5)) // 2-7天后送达
	return date.toISOString()
}

// 生成订单ID
function generateOrderId() {
	const now = new Date()
	const year = now.getFullYear()
	const month = (now.getMonth() + 1).toString().padStart(2, '0')
	const randomStr = Math.random().toString(36).substr(2, 6).toUpperCase()
	return `ORD${year}${month}${randomStr}`
}

// 生成用户ID
function generateUserId() {
	return 'USER' + Math.random().toString(36).substr(2, 8).toUpperCase()
}

// 生成2300条订单数据
function generateOrders(count = 1666) {
	const orders: Order[] = []

	for (let i = 0; i < count; i++) {
		const orderTime = generateRandomDate()
		const items = generateOrderItems()
		const amount = calculateTotalAmount(items)
		const statusValues = Object.values(OrderStatus)
		const status = statusValues[Math.floor(Math.random() * statusValues.length)]
		const order: Order = {
			id: generateOrderId(),
			status: status,
			orderTime: orderTime,
			amount: amount,
			user: {
				id: generateUserId(),
				phone: generatePhoneNumber(),
				name: generateChineseName(),
			},
			items: items,
		}

		// 只有已发货和已完成的订单有送达时间
		if (status === OrderStatus.SHIPPED || status === OrderStatus.COMPLETED) {
			order.deliveryTime = generateDeliveryTime(orderTime)
		} else {
			order.deliveryTime = ''
		}

		orders.push(order)
	}

	return orders
}

export default generateOrders

// 导出为JSON文件（在Node.js环境中）
// const fs = require('fs');
// fs.writeFileSync('orders.json', JSON.stringify(orders, null, 2));
