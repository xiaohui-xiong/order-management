<template>
  <div id="app">
    <el-container style="height: 100vh;">
      <el-header v-if="$route.name !== 'Login'" class="app-header">
        <div class="logo">订单管理系统</div>
        <div class="user-info">
          <el-dropdown>
            <span class="el-dropdown-link">
              <el-avatar icon="el-icon-user-solid" />
              <span class="name">{{ user?.username || "管理员" }}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useAuthStore } from "./store/auth";

const authStore = useAuthStore();
const user = computed(() => authStore.user);

// 退出登录
const handleLogout = () => {
  authStore.logout();
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
}

.app-header {
  background-color: #409eff;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.logo {
  font-size: 20px;
  font-weight: bold;
}

.user-info {
  cursor: pointer;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  color: white;
}

.el-main {
  padding: 0;
}

.name {
  margin-left: 6px;
}
</style>