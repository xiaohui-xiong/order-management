<template>
  <div class="order-list">
    <el-page-header @back="goBack" content="订单管理" />

    <el-card class="main-card">
      <template #header>
        <h2>订单列表</h2>
      </template>

      <OrderTable :loading="loading" :orderData="orderData" @view-detail="viewOrderDetail" />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import OrderTable from "@/components/OrderTable.vue";
import type { Order } from "@/type/order.types";
import { mockData } from "@/api/mockData";
import { ElMessage } from "element-plus";

const router = useRouter();
const loading = ref(false);

const orderData = ref<Order[]>([]);

// 携带订单ID跳转订单详情
const viewOrderDetail = (orderId: string) => {
  router.push({ name: "OrderDetail", params: { id: orderId } });
};

onMounted(async () => {
  try {
    const data = await mockData.getOrders();
    if (data.iRet === 0) {
      orderData.value = data.data;
      loading.value = false;
    } else {
      loading.value = true;
    }
  } catch (error) {
    ElMessage.error("获取订单失败");
    loading.value = true;
  }
});

const goBack = () => {
  router.push("/");
};
</script>

<style scoped>
.order-list {
  padding: 20px;
}

.main-card {
  margin-top: 20px;
}
</style>
