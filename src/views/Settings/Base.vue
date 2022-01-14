<!--2021-10-29 zzc 基础设置表单-->
<script lang="ts" setup>
import { ref, toRaw, onMounted } from 'vue'
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import SettingsApi, { BaseSettingsConfig } from '@/api/settings'

const formRef = ref();

const formState = ref<BaseSettingsConfig>({
  web_name: '',
  web_slogan: '',
  web_notice: '',
  web_title: '',
  web_url: '',
  web_beian: '',
  web_mail: '',
  web_version: '',
  web_keywords: '',
  web_description: '',
  web_date: undefined,
  web_tongji: '',
  web_copyright: '',
  open_comment: true,
  web_avatar: '',
  web_logo: '',
  web_like: 0,
})

const rules = {}
const labelCol = { style: { width: '100px' } }

// 获取详情
const getDetail = async () => {
  const { data } = await SettingsApi.getBaseSettings()
  if (data) {
    data.web_notice = data.web_notice.join()
    data.web_date = dayjs(data.web_date, 'YYYY-MM-DD')
    formState.value = data
  }
}

const onSubmit = () => {
  formRef.value.validate().then(async () => {
    const rawValue = toRaw(formState.value)
    const data = { ...rawValue, web_notice: rawValue.web_notice.split(',') }
    console.log(data)
    await SettingsApi.saveBaseSettings(data)
    message.success('保存成功')
  })
  .catch((error: ValidateErrorEntity<BaseSettingsConfig>) => {
    console.log('error', error)
  })
}

const resetForm = () => {
  formRef.value.resetFields()
}

onMounted(() => {
  getDetail()
})

</script>

<template>
  <div class="base-settings">
    <a-form ref="formRef" :model="formState" :rules="rules" :label-col="labelCol">
      
      <div class="formitem-wrap">
        <a-form-item label="logo">
          <div style="height: 58px;width:158px">
            <yzp-upload
              v-model:value="formState.web_logo"
              :clip="true"
              :width="150"
              :height="58"
              :with-parent-with="true"
              filename="author_avatar"
            ></yzp-upload>
          </div>
        </a-form-item>

        <a-form-item label="头像">
          <div style="height: 58px;width:58px">
            <yzp-upload
              v-model:value="formState.web_avatar"
              :clip="true"
              :width="100"
              :height="100"
              :with-parent-with="true"
              filename="logo"
            ></yzp-upload>
          </div>
        </a-form-item>
      </div>

      <div class="formitem-wrap">
        <a-form-item label="网站名称">
          <a-input v-model:value="formState.web_name" placeholder="请输入网站名称" />
        </a-form-item>

        <a-form-item label="网站标题">
          <a-input v-model:value="formState.web_title" placeholder="请输入网站标题" />
        </a-form-item>

        <a-form-item label="个性签名">
          <a-input v-model:value="formState.web_slogan" placeholder="请输入个性签名" />
        </a-form-item>

        <a-form-item label="网址">
          <a-input v-model:value="formState.web_url" placeholder="请输入网址" />
        </a-form-item>

        <a-form-item label="备案信息">
          <a-input v-model:value="formState.web_beian" placeholder="请输入备案信息" />
        </a-form-item>

        <a-form-item label="邮箱">
          <a-input v-model:value="formState.web_mail" placeholder="请输入邮箱" />
        </a-form-item>

        <a-form-item label="版本">
          <a-input v-model:value="formState.web_version" placeholder="请输入版本" />
        </a-form-item>

        <a-form-item label="版权信息">
          <a-input v-model:value="formState.web_copyright" placeholder="请输入版权信息" />
        </a-form-item>

        <a-form-item label="关键字">
          <a-textarea v-model:value="formState.web_keywords" rows="3" placeholder="请输入关键字" />
        </a-form-item>

        <a-form-item label="网站描述">
          <a-textarea v-model:value="formState.web_description" rows="3" placeholder="请输入网站描述" />
        </a-form-item>

        <a-form-item label="网站公告">
          <a-textarea v-model:value="formState.web_notice" rows="3" placeholder="请输入网站公告，英文逗号隔开" />
        </a-form-item>

        <a-form-item label="统计代码">
          <a-textarea v-model:value="formState.web_tongji" rows="3" placeholder="请输入统计代码" />
        </a-form-item>

        <a-form-item label="建站日期">
          <a-date-picker
            v-model:value="formState.web_date"
            placeholder="请选择日期"
            style="display:block "
          />
        </a-form-item>

        <a-form-item label="点赞量">
          <a-input v-model:value="formState.web_like" type="number" placeholder="请输入点赞量" />
        </a-form-item>

        <a-form-item label="评论开关">
          <a-switch v-model:checked="formState.open_comment" />
        </a-form-item>
      </div>

      <a-form-item style="margin-left: 100px;">
        <a-button type="primary" @click="onSubmit">立即保存</a-button>
        <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped lang="less">
.formitem-wrap {
  display: flex;
  flex-wrap: wrap;
  :deep(.ant-form-item) {
    width: 33.33%;
  }
}
</style>