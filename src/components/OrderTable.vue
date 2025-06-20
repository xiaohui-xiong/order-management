<template>
  <div>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="订单ID">
        <el-input
          v-model="searchForm.id"
          placeholder="请输入订单ID"
          clearable
        />
      </el-form-item>
      <el-form-item label="用户手机">
        <el-input
          v-model="searchForm.phone"
          placeholder="请输入手机号"
          clearable
        />
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select
          v-model="searchForm.status"
          placeholder="请选择状态"
          style="width: 200px"
          clearable
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="时间日期">
        <el-date-picker
          v-model="searchForm.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="dateChange"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮 -->
    <div class="table-actions">
      <el-button type="primary" @click="handleExport">导出订单</el-button>
    </div>

    <!-- 订单表格 -->
    <el-table
      :data="pagedOrders"
      border
      v-loading="loading"
      @sort-change="handleSortChange"
    >
      <el-table-column prop="id" label="订单ID" width="180" sortable="custom" />
      <el-table-column prop="status" label="订单状态" width="120">
        <template #default="{ row }">
          <el-tag :type="statusTagType(row.status)" effect="plain">
            {{ statusMap[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="user.name" label="用户名" width="120" />
      <el-table-column prop="user.phone" label="用户手机" width="150" />
      <el-table-column
        prop="orderTime"
        label="下单时间"
        width="180"
        sortable="custom"
      >
        <template #default="{ row }">
          {{ formatDate(row.orderTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="订单金额(元)" sortable="custom">
        <template #default="{ row }">
          <span style="color: #e6a23c; font-weight: bold"
            >¥{{ row.amount.toFixed(2) }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="deliveryTime" label="预计送达时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.deliveryTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="$emit('view-detail', row.id)"
          >
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="pagination.currentPage"
      v-model:page-size="pagination.pageSize"
      :page-sizes="[5, 10, 20, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="filteredOrders.length"
      class="pagination"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive } from "vue";
import type { Order, OrderStatus } from "../api/mockData";
import { throttle } from "../utils";
import { orders } from "../api/mockData";
import { ElMessage } from "element-plus";

// 定义Props
defineProps({
  loading: Boolean,
});

// 定义事件
defineEmits(["view-detail"]);

// 状态映射
const statusMap: Record<OrderStatus, string> = {
  pending: "待付款",
  shipped: "已发货",
  completed: "已完成",
  cancelled: "已取消",
};

const statusOptions = [
  { value: "pending", label: "待付款" },
  { value: "shipped", label: "已发货" },
  { value: "completed", label: "已完成" },
  { value: "cancelled", label: "已取消" },
];

const statusTagType = (status: OrderStatus): string => {
  const types: Record<OrderStatus, string> = {
    pending: "warning",
    shipped: "primary",
    completed: "success",
    cancelled: "danger",
  };
  return types[status];
};

// 搜索表单
const searchForm = reactive({
  id: "",
  phone: "",
  status: "" as OrderStatus | "",
  date: [] as any,
});

// 分页设置
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
});

// 排序设置
const sortOptions = reactive({
  prop: "",
  order: "" as "" | "ascending" | "descending",
});

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

// 处理搜索
const handleSearch = throttle(
  function () {
    console.log("搜索");
  },
  {
    leading: true,
    trailing: false,
    delay: 2000,
  }
);

const dateChange = () => {
  const date = searchForm.date;
  const startDate = date[0];
  const endDate = date[1];
  const filteredData = orders.filter((order) => {
    const orderDate = new Date(order.orderTime);
    console.log(111111, orderDate);
    console.log(111111, startDate);
    console.log(111111, orderDate);
    console.log(111111, endDate);
    return orderDate >= startDate && orderDate <= endDate;
  });
  console.log(filteredData);
};

// // 处理搜索
// const handleSearch = throttle()() => {
//   pagination.currentPage = 1;
// };

// 处理重置
const handleReset = () => {
  searchForm.id = "";
  searchForm.phone = "";
  searchForm.status = "";
  searchForm.date = [];
  pagination.currentPage = 1;
};

// 处理导出
const handleExport = () => {
  // 模拟导出功能
  const filtered = filteredOrders.value;
  const header = [
    "订单ID",
    "状态",
    "用户名",
    "手机号",
    "下单时间",
    "金额",
    "送达时间",
  ];
  const csvContent = [
    header.join(","),
    ...filtered.map((order) =>
      [
        order.id,
        statusMap[order.status],
        order.user.name,
        order.user.phone,
        new Date(order.orderTime).toLocaleString(),
        order.amount.toFixed(2),
        new Date(order.deliveryTime || "").toLocaleString() || "",
      ].join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `订单导出_${new Date().toISOString().slice(0, 10)}.csv`
  );
  link.click();

  // 实际项目中这里应该是API请求
  ElMessage.success("导出成功");
};

// 处理排序
const handleSortChange = ({ prop, order }: { prop: string; order: string }) => {
  sortOptions.prop = prop;
  sortOptions.order = order === "ascending" ? "ascending" : "descending";
};

// 过滤后的订单数据
const filteredOrders = computed(() => {
  let result = [...orders];
  const date = searchForm.date;

  // 应用搜索条件
  if (searchForm.id) {
    result = result.filter((order) => order.id.includes(searchForm.id));
  }

  if (searchForm.phone) {
    result = result.filter((order) =>
      order.user.phone.includes(searchForm.phone)
    );
  }

  if (searchForm.status) {
    result = result.filter((order) => order.status === searchForm.status);
  }

  if (searchForm.date && date.length === 2) {
    const startDate = date[0];
    const endDate = date[1];
    result = result.filter((order) => {
      const orderDate = new Date(order.orderTime);
      return orderDate >= startDate && orderDate <= endDate;
    });
  }

  // 应用排序
  if (sortOptions.prop && sortOptions.order) {
    const prop = sortOptions.prop as keyof Order;
    const order = sortOptions.order;

    result.sort((a, b) => {
      const aVal = a[prop];
      const bVal = b[prop];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return order === "ascending"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return order === "ascending" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }

  return result;
});

// 分页后的数据（实际项目中分页通常由后端处理）
const pagedOrders = computed(() => {
  const start = (pagination.currentPage - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  return filteredOrders.value.slice(start, end);
});
</script>

<style scoped>
.search-form {
  margin-bottom: 20px;
}

.table-actions {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}

.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>
