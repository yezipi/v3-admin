<script lang="ts" setup>
import { ref, toRaw } from 'vue'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import SettingsApi, { AliyunSettingsConfig } from '@/api/settings'

const formRef = ref();
const labelCol = { style: { width: '150px' } }
const formState = ref<AliyunSettingsConfig>({
  region: '',
  accessKeyId: '',
  accessKeySecret: '',
  bucket: '',
  dir: '',
  open: false,
})

const rules: Record<string, Rule[]> = {}

// 获取详情
const getDetail = async () => {
  const { data } = await SettingsApi.getAliyunSettings()
  if (data) {
    formState.value = data
  }
}

const onSubmit = () => {
  formRef.value.validate().then(async () => {
    const rawValue = toRaw(formState.value)
    await SettingsApi.saveAliyunettings(rawValue)
    message.success('保存成功')
  })
}

getDetail()
</script>

<template>
  <div class="mail-settings">
    <a-form ref="formRef" :model="formState" :rules="rules" :label-col="labelCol">
      <a-form-item label="region">
        <a-input v-model:value="formState.region" placeholder="请填写阿里云的region" />
      </a-form-item>

      <a-form-item label="accessKeyId">
        <a-input v-model:value="formState.accessKeyId" placeholder="请填写阿里云的accessKeyId" />
      </a-form-item>

      <a-form-item label="accessKeySecret">
        <a-input v-model:value="formState.accessKeySecret" placeholder="请填写阿里云的accessKeySecret" />
      </a-form-item>

      <a-form-item label="bucket">
        <a-input v-model:value="formState.bucket" placeholder="请填写阿里云的bucket名称" />
      </a-form-item>

      <a-form-item label="dir">
        <a-input v-model:value="formState.dir" placeholder="请填写阿里云存储的一级目录" />
      </a-form-item>

      <a-form-item label="启用">
        <a-switch v-model:checked="formState.open" />
        <span style="color: orange;display: inline-block;margin-left: 12px;">不启用则上传到服务器</span>
      </a-form-item>

      <a-form-item style="margin-left: 100px;">
        <a-button type="primary" @click="onSubmit">立即保存</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
