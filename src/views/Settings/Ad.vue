<template>
  <div class="mail-settings">
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="labelCol"
    >
      <a-form-item label="首页" :wrapperCol="wrapperCol">
        <a-textarea v-model:value="formState.banner" placeholder="首页广告"></a-textarea>
      </a-form-item>

      <a-form-item label="侧边栏" :wrapperCol="wrapperCol">
        <a-textarea v-model:value="formState.aside" placeholder="侧边栏广告"></a-textarea>
      </a-form-item>

      <a-form-item label="悬浮" :wrapperCol="wrapperCol">
        <a-textarea v-model:value="formState.float" placeholder="悬浮广告"></a-textarea>
      </a-form-item>

      <a-form-item label="显示" :wrapperCol="wrapperCol">
        <a-switch v-model:checked="formState.status"></a-switch>
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
import SettingsApi, { AdSettingsConfig } from '@/api/settings'

export default defineComponent({
  setup() {
    const formRef = ref();

    let formState = ref<AdSettingsConfig> ({
      banner: '',
      aside: '',
      float: '',
      status: false,
    });

    const rules = {};

    // 获取详情
    const getDetail = async () => {
      const { data } = await SettingsApi.getAdSettings()
      if (data) {
        formState.value = data
      }
    }

    const onSubmit = () => {
      formRef.value
        .validate()
        .then(async () => {
          const rawValue = toRaw(formState.value)
          await SettingsApi.saveAdSettings(rawValue)
          message.success('保存成功')
        })
        .catch((error: ValidateErrorEntity<AdSettingsConfig>) => {
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
