<script lang="ts" setup>
import { ref, toRaw, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import SettingsApi, { SecuritySettingsConfig } from '@/api/settings'

const formRef = ref();
const labelCol = { style: { width: '100px' } }
const formState = ref<SecuritySettingsConfig>({
  black_ip: '',
})

const rules = {}

// 获取详情
const getDetail = async () => {
  const { data } = await SettingsApi.getSecuritySettings()
  if (data) {
    formState.value = data
  }
}

const onSubmit = () => {
  formRef.value.validate().then(async () => {
    const rawValue = toRaw(formState.value)
    await SettingsApi.saveSecuritySettings(rawValue)
    message.success('保存成功')
  })
}


onMounted(() => {
  getDetail()
})
</script>

<template>
  <div class="mail-settings">
    <a-form ref="formRef" :model="formState" :rules="rules" :label-col="labelCol">
      <a-form-item label="黑名单ip">
        <a-textarea v-model:value="formState.black_ip" rows="3" placeholder="请输入要拦截的ip，英文逗号隔开"></a-textarea>
      </a-form-item>

      <a-form-item style="margin-left: 100px;">
        <a-button type="primary" @click="onSubmit">立即保存</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
