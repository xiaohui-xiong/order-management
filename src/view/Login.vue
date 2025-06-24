<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">登录系统</h2>
      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
      </el-form>
      <div>
        <el-button class="login-button" type="primary" @click="handleLogin" :loading="loading">
          登录
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/auth";
import { ElMessage } from "element-plus";
import { md5 } from "../utils/crypto";

const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);

const loginForm = ref({
  username: "admin",
  password: "admin123",
});

const loginFormRef = ref();

const loginRules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    {
      min: 3,
      max: 20,
      message: "用户名长度在 3 到 20 个字符",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度在 6 到 20 个字符", trigger: "blur" },
  ],
};

const handleLogin = () => {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      loading.value = true;

      authStore
        .login(loginForm.value.username, md5(loginForm.value.password))
        .then(() => {
          ElMessage.success("登录成功");
          router.push("/orders");
        })
        .catch((error) => {
          ElMessage.error(error.message);
        })
        .finally(() => {
          loading.value = false;
        })
    }
  });
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.login-card {
  width: 400px;
  padding: 30px 30px 15px 30px;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
  color: #409eff;
}

.login-button {
  margin: 0 auto;
  display: block;
}
</style>