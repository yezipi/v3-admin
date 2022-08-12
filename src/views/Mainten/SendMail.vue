<script lang="ts" setup>
import { ref } from 'vue'
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface'
import { message } from 'ant-design-vue'
import CommonApi from '@/api/common'
import type { Rule } from 'ant-design-vue/es/form'
import { useRouter } from 'vue-router'

type MailSend = {
  subject: string
  html: string
  recipient: string
}

const formRef = ref();

const formState = ref<MailSend>({
  subject: '',
  html: '',
  recipient: '',
})

const rules: Record<string, Rule[]> = {
  subject: [{ required: true, message: '请填写标题', trigger: 'blur' }],
  html: [{ required: true, message: '请填写内容', trigger: 'blur' }],
  recipient: [{ required: true, message: '请填写收件人邮箱', trigger: 'blur' }],
}
const labelCol = { style: { width: '100px' } }

const router = useRouter()

const onSubmit = () => {
  formRef.value.validate().then(async () => {
    await CommonApi.sendMail(formState.value)
    message.success('发送成功')
    router.replace('/mail/logs')
  })
  .catch((error: ValidateErrorEntity<MailSend>) => {
    console.log('error', error)
  })
}

const resetForm = () => {
  formRef.value.resetFields()
}

</script>

<template>
  <div class="mail-settings">
    <a-form ref="formRef" :model="formState" :rules="rules" :label-col="labelCol">
      <a-form-item label="收件邮箱" name="recipient">
        <a-input v-model:value="formState.recipient" placeholder="请填写收件人邮箱" name="email"></a-input>
      </a-form-item>

      <a-form-item label="标题" name="subject">
        <a-input v-model:value="formState.subject" placeholder="请填写标题" :maxlength="30"></a-input>
      </a-form-item>

      <a-form-item label="内容" name="html" class="maxwidth-100">
        <yzp-editor v-model:value="formState.html" placeholder="请填写正文内容" />
      </a-form-item>

      <a-form-item style="margin-left: 100px;">
        <a-button type="primary" @click="onSubmit">立即发送</a-button>
        <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
