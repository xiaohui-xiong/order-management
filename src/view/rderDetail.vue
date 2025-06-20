<template>
  <div class="order-detail">
    <el-page-header @back="goBack" content="订单详情" />

    <el-card class="main-card">
      <template #header>
        <h2>订单信息</h2>
      </template>

      <div v-if="order">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单ID">{{
            order.id
          }}</el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag :type="statusTagType(order.status)" effect="plain">
              {{ statusMap[order.status] }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="用户姓名">{{
            order.user.name
          }}</el-descriptions-item>
          <el-descriptions-item label="用户手机">{{
            order.user.phone
          }}</el-descriptions-item>
          <el-descriptions-item label="下单时间">{{
            formatDate(order.orderTime)
          }}</el-descriptions-item>
          <el-descriptions-item label="订单金额"
            >¥{{ order.amount.toFixed(2) }}</el-descriptions-item
          >
          <el-descriptions-item label="预计送达时间">
            {{ formatDate(order.deliveryTime || "") || "未设置" }}
          </el-descriptions-item>
        </el-descriptions>

        <el-divider />

        <h3>订单商品</h3>
        <el-table :data="order.items" border class="items-table">
          <el-table-column prop="name" label="商品名称" />
          <el-table-column label="单价">
            <template #default="{ row }">
              ¥{{ row.price.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" />
          <el-table-column label="小计">
            <template #default="{ row }">
              ¥{{ (row.price * row.quantity).toFixed(2) }}
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-empty v-else description="订单不存在" />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { orders } from "../api/mockData";
import type { Order, OrderStatus } from "../api/mockData";

const route = useRoute();
const router = useRouter();

// 状态映射
const statusMap: Record<OrderStatus, string> = {
  pending: "待付款",
  shipped: "已发货",
  completed: "已完成",
  cancelled: "已取消",
};

// 订单的状态
const statusTagType = (status: OrderStatus): string => {
  const types: Record<OrderStatus, string> = {
    pending: "warning",
    shipped: "primary",
    completed: "success",
    cancelled: "danger",
  };
  return types[status];
};

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleString();
};

const order = ref<Order | null>(null);

onMounted(() => {
  const id = route.params.id as string;
  order.value = orders.find((o) => o.id === id) || null;
});

const goBack = () => {
  router.push("/orders");
};
</script>

<style scoped>
.order-detail {
  padding: 20px;
}

.main-card {
  margin-top: 20px;
}

.items-table {
  margin-top: 20px;
}
</style>