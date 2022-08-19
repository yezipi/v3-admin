<script lang="ts" setup>
import { ref, toRaw } from 'vue'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import SettingsApi, { MaintenanceSettingsConfig } from '@/api/settings'

const formRef = ref();
const labelCol = { style: { width: '100px' } }
const formState = ref<MaintenanceSettingsConfig>({
  content: '',
  open: false,
})

const rules: Record<string, Rule[]> = {}

// 获取详情
const getDetail = async () => {
  const { data } = await SettingsApi.getMaintenanceSettings()
  if (data) {
    formState.value = data
  }
}

const onSubmit = () => {
  formRef.value.validate().then(async () => {
    const rawValue = toRaw(formState.value)
    await SettingsApi.saveMaintenanceSettings(rawValue)
    message.success('保存成功')
  })
}

getDetail()
</script>

<template>
  <div class="mail-settings">
    <a-form ref="formRef" :model="formState" :rules="rules" :label-col="labelCol">
      <a-form-item label="维护内容" class="maxwidth-100">
        <yzp-editor v-model:value="formState.content" :rows="3" placeholder="请输入网站维护内容" />
      </a-form-item>

      <a-form-item label="开启维护">
        <a-switch v-model:checked="formState.open" />
      </a-form-item>

      <a-form-item style="margin-left: 100px;">
        <a-button type="primary" @click="onSubmit">立即保存</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
