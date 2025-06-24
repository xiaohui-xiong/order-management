<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination :background="background" v-model:current-page="currentPage" v-model:page-size="pageSize"
      :layout="layout" :page-sizes="pageSizes" :total="total" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

// 定义Props
const props = defineProps({
  // 总数据数
  total: {
    required: true,
    type: Number,
  },
  // 页数
  page: {
    type: Number,
    default: 1,
  },
  // 初始数据条数
  limit: {
    type: Number,
    default: 20,
  },
  // 每页多少数据
  pageSizes: {
    type: Array,
    default() {
      return [10, 20, 30, 50];
    },
  },
  // 
  layout: {
    type: String,
    default: "total, sizes, prev, pager, next, jumper",
  },
  // 背景
  background: {
    type: Boolean,
    default: true,
  },
  // 是否显示
  hidden: {
    type: Boolean,
    default: false,
  },
});

// 定义事件
const emit = defineEmits(['update:page', 'update:limit']);

const currentPage = computed({
  get() {
    return props.page;
  },
  set(val) {
    emit('update:page', val);
  },
});
const pageSize = computed({
  get() {
    return props.limit;
  },
  set(val) {
    emit('update:limit', val);
  },
});
</script>
