<template>
  <div class="order-list">
    <el-page-header @back="goBack" content="订单管理" />

    <el-card class="main-card">
      <template #header>
        <h2>订单列表</h2>
      </template>

      <OrderTable :loading="loading" @view-detail="viewOrderDetail" />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import OrderTable from "../components/OrderTable.vue";

const router = useRouter();
const loading = ref(false);

const viewOrderDetail = (orderId: string) => {
  router.push({ name: "OrderDetail", params: { id: orderId } });
};

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