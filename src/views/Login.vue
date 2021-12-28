<template>
  <div class="login-page">
    <div class="lp-main">
      <h2>管理员登录</h2>
      <a-form ref="formRef" :model="formVal" :rules="rules" class="lp-form">
        <a-form-item class="lp-input" name="name">
          <a-input placeholder="请输入账号" v-model:value="formVal.name">
            <template #prefix>
              <UserOutlined :style="{ color: '#999999' }" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item class="lp-input" name="password">
          <a-input placeholder="请输入密码" type="password" v-model:value="formVal.password">
            <template #prefix>
              <LockOutlined :style="{ color: '#999999' }" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item class="lp-submit">
          <a-button size="large" block type="primary" :loading="loading" @click="onSubmit">登录</a-button>
        </a-form-item>
      </a-form>
      <span class="lp-copyright">椰子皮博客2016 - {{ new Date().getFullYear() }} © 版权所有</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import UserApi from '@/api/user'

const formRef = ref();

const formVal = reactive({
  name: '',
  password: '',
});

const loading = ref(false)

const { commit } = useStore()
const router = useRouter()
const route = useRoute()
const referrer: any = route.query.referrer

const rules = {
  name: {
    required: true,
    message: '请输入正确的账号',
  },
  password: {
    required: true,
    message: '请输入正确的密码',
  },
};

const onSubmit = () => {
  formRef.value.validate().then(async () => {
    try {
      loading.value = true
      const { data: { token, user } } = await UserApi.login(formVal)
      commit('updateToken', token)
      commit('updateUser', user)
      router.replace({
        name: referrer && referrer !== 'Login' && referrer !== 'Result' ? decodeURIComponent(referrer) : 'Home'
      })
    } catch (e) {
      console.log(e)
    } finally {
      loading.value = false
    }
  })
};
</script>

<style scoped lang="less">
.login-page {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  .lp-main {
    width: 350px;
    h2 {
      color: #666666;
      margin-bottom: 20px;
      display: block;
      text-align: center;
    }
  }
  .lp-copyright {
    display: block;
    text-align: center;
    font-size: 12px;
  }
}
</style>