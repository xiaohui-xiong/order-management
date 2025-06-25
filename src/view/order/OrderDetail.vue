<template>
  <div class="order-detail">
    <el-page-header @back="goBack" content="订单详情" />

    <el-card class="main-card">
      <template #header>
        <h2>订单信息</h2>
      </template>

      <div v-if="order">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单ID">{{ order.id }}</el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag :type="statusTagType(order.status)" effect="plain">
              {{ getOrderStatusText(order.status) }}
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
          <el-descriptions-item label="订单金额">¥{{ order.amount.toFixed(2) }}</el-descriptions-item>
          <el-descriptions-item label="预计送达时间">
            {{ formatDate(order.deliveryTime || "") || "无" }}
          </el-descriptions-item>
        </el-descriptions>

        <el-divider />

        <h3>订单商品</h3>
        <el-table :data="order.items" border class="items-table">
          <el-table-column prop="name" label="商品名称" />
          <el-table-column label="单价">
            <template #default="{ row }"> ¥{{ row.price.toFixed(2) }} </template>
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
import { mockData } from "@/api/mockData";
import type { Order } from "@/type/order.types";
import { formatDate } from "@/utils";
import { getOrderStatusText, statusTagType } from "@/enums/order-status.enum";
import { ElMessage } from "element-plus";

const route = useRoute();
const router = useRouter();

const id = route.params.id;

const order = ref<Order | null>(null);

// 初始获取订单列表查询订单详情
onMounted(async () => {
  try {
    const data = await mockData.getOrders();
    if (data.iRet === 0) {
      order.value = data.data.find((o) => o.id === id) || null;
    }
  } catch (error) {
    ElMessage.error('获取订单失败')
  }

});

// 跳转回订单列表
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
