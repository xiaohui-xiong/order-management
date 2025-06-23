/**
 * 订单状态枚举
 */
export enum OrderStatus {
	// 待付款
	PENDING_PAYMENT = 'PENDING_PAYMENT',
	// 已发货
	SHIPPED = 'SHIPPED',
	// 已完成
	COMPLETED = 'COMPLETED',
	// 已取消
	CANCELLED = 'CANCELLED',
}

/**
 * 获取订单状态文本
 * @param status 订单状态
 */
export function getOrderStatusText(status: OrderStatus): string {
	const statusMap = {
		[OrderStatus.PENDING_PAYMENT]: '待付款',
		[OrderStatus.SHIPPED]: '已发货',
		[OrderStatus.COMPLETED]: '已完成',
		[OrderStatus.CANCELLED]: '已取消',
	}
	return statusMap[status] || '未知状态'
}


// 订单的状态
export const statusTagType = (status: OrderStatus): string => {
  const types: Record<OrderStatus, string> = {
    PENDING_PAYMENT: "warning",
    SHIPPED: "primary",
    COMPLETED: "success",
    CANCELLED: "danger",
  };
  return types[status];
};

