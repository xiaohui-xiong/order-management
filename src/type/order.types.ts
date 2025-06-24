import { OrderStatus } from '@/enums/order-status.enum'
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

// 商品接口
export interface OrderItem {
	name: string
	price: number
	quantity: number
}
