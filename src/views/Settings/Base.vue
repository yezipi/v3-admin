<!--2021-10-29 zzc 基础设置表单-->
<script lang="ts" setup>
import { ref, toRaw, onMounted } from 'vue'
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import SettingsApi, { BaseSettingsConfig } from '@/api/settings'
import type { Rule } from 'ant-design-vue/es/form'

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
  audit_comment: true,
  audit_feedback: true,
  web_avatar: '',
  web_logo: '',
  web_like: 0,
  alipay_code: '',
  wxpay_code: '',
  gzh_code: '',
})

const rules: Record<string, Rule[]> = {}
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
    <a-form ref="formRef" layout="vertical" :model="formState" :rules="rules" :label-col="labelCol">
      
      <div class="formitem-wrap">
        <a-form-item label="logo">
          <div style="height: 58px;width:158px">
            <yzp-upload
              v-model:value="formState.web_logo"
              :clip="false"
              :with-parent-with="true"
              filename="logo"
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
              filename="author_avatar"
            ></yzp-upload>
          </div>
        </a-form-item>
      </div>

      <div class="formitem-wrap">

        <a-form-item label="支付宝收款码">
          <div style="height: 58px;width:58px">
            <yzp-upload
              v-model:value="formState.alipay_code"
              :width="150"
              :height="150"
              :with-parent-with="true"
              filename="alipay_code"
            ></yzp-upload>
          </div>
        </a-form-item>

        <a-form-item label="微信收款码">
          <div style="height: 58px;width:58px">
            <yzp-upload
              v-model:value="formState.wxpay_code"
              :width="150"
              :height="150"
              :with-parent-with="true"
              filename="wxpay_code"
            ></yzp-upload>
          </div>
        </a-form-item>

        <a-form-item label="公众号二维码">
          <div style="height: 58px;width:58px">
            <yzp-upload
              v-model:value="formState.gzh_code"
              :width="150"
              :height="150"
              :with-parent-with="true"
              filename="gzh_code"
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

        <!-- <a-form-item label="版权信息">
          <a-input v-model:value="formState.web_copyright" placeholder="请输入版权信息" />
        </a-form-item> -->

        <a-form-item label="关键字">
          <a-textarea v-model:value="formState.web_keywords" :rows="3" placeholder="请输入关键字" />
        </a-form-item>

        <a-form-item label="网站描述">
          <a-textarea v-model:value="formState.web_description" :rows="3" placeholder="请输入网站描述" />
        </a-form-item>

        <a-form-item label="网站公告">
          <a-textarea v-model:value="formState.web_notice" :rows="3" placeholder="请输入网站公告，英文逗号隔开" />
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

      </div>

      <div class="formitem-wrap">
        <a-form-item label="开启评论">
          <a-switch v-model:checked="formState.open_comment" />
        </a-form-item>
        <a-form-item label="评论审核">
          <a-switch v-model:checked="formState.audit_comment" />
        </a-form-item>
        <a-form-item label="留言审核">
          <a-switch v-model:checked="formState.audit_feedback" />
        </a-form-item>
      </div>

      <a-form-item style="margin-left: 1.5%;">
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
    width: 30.33%;
    margin-left: 3%;
    &:nth-child(3n - 2) {
      margin-left: 1.5%;
    }
  }
}
</style>