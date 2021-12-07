<template>
  <div class="mail-settings">
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="labelCol"
    >
      <h4 class="form-sub-title">发件人</h4>
      <a-form-item label="发件人名称" :wrapperCol="wrapperCol">
        <a-input v-model:value="formState.send_nickname" placeholder="发件人名称" :maxlength="30">
        </a-input>
      </a-form-item>

      <a-form-item label="发件服务器" :wrapperCol="wrapperCol">
        <a-input v-model:value="formState.host" placeholder="发件邮件服务器,例如：smtp.exmail.qq.com">
        </a-input>
      </a-form-item>

      <a-form-item label="端口号" :wrapperCol="wrapperCol">
        <a-input v-model:value="formState.port" placeholder="服务器端口号">
        </a-input>
      </a-form-item>

      <a-form-item label="发件人邮箱" :wrapperCol="wrapperCol">
        <a-input v-model:value="formState.send_mail" placeholder="发件人邮箱">
        </a-input>
      </a-form-item>

      <a-form-item label="邮箱密码" :wrapperCol="wrapperCol">
        <a-input v-model:value="formState.send_pwd" placeholder="发件人邮箱密码">
        </a-input>
      </a-form-item>

      <h4 class="form-sub-title">收件人</h4>
      <a-form-item label="收件人邮箱" :wrapperCol="wrapperCol">
        <a-input v-model:value="formState.receive_mail" placeholder="收件人邮箱">
        </a-input>
      </a-form-item>

      <h4 class="form-sub-title">通知设置</h4>
      <a-form-item label="发件标题" :wrapperCol="wrapperCol">
        <a-input v-model:value="formState.send_title" placeholder="发件标题">
        </a-input>
      </a-form-item>

      <a-form-item label="收件标题" :wrapperCol="wrapperCol">
        <a-input v-model:value="formState.receive_title" placeholder="收件标题">
        </a-input>
      </a-form-item>

      <a-form-item label="邮件通知我" :wrapperCol="wrapperCol">
        <a-switch v-model:checked="formState.receive_notice"></a-switch>
      </a-form-item>

      <a-form-item :wrapperCol="{ offset: 2 }">
        <a-button type="primary" @click="onSubmit">立即保存</a-button>
        <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRaw, onMounted } from 'vue'
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface'
import { message } from 'ant-design-vue'
import SettingsApi, { MailSettingsConfig } from '@/api/settings'

export default defineComponent({
  setup() {
    const formRef = ref();

    let formState = ref<MailSettingsConfig> ({
      host: '',
      port: '',
      send_nickname: '',
      send_mail: '',
      send_pwd: '',
      send_title: '',
      receive_mail: '',
      receive_title: '',
      receive_notice: false,
    });

    const rules = {};

    // 获取详情
    const getDetail = async () => {
      const { data } = await SettingsApi.getMailSettings()
      if (data) {
        formState.value = data
      }
    }

    const onSubmit = () => {
      formRef.value
        .validate()
        .then(async () => {
          const rawValue = toRaw(formState.value)
          await SettingsApi.saveMailSettings(rawValue)
          message.success('保存成功')
        })
        .catch((error: ValidateErrorEntity<MailSettingsConfig>) => {
          console.log('error', error);
        });
    };

    const resetForm = () => {
      formRef.value.resetFields();
    };

    onMounted(() => {
      getDetail()
    })

    return {
      formRef,
      labelCol: { span: 2 },
      wrapperCol: { span: 10 },
      formState,
      rules,
      onSubmit,
      resetForm,
    };
  },
});
</script>

<style lang="less" scoped>
.form-sub-title {
  padding: 15px;font-weight: bold;color: #ff6666
}
</style>