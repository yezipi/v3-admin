<script lang="ts" setup>
import { ref, toRaw, onMounted } from 'vue'
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface'
import { message } from 'ant-design-vue'
import SettingsApi, { BaiduConfig } from '@/api/settings'
import ReportApi from '@/api/report'

const formRef = ref();

const ruleForm = ref<BaiduConfig>({
  appid: '',
  secret: '',
  code: '',
  site_id: '',
})

const rules = {
  appid: [{ required: true, message: '请填写百度统计的API Key', trigger: 'blur' }],
  secret:[ { required: true, message: '百度统计的Secret Key', trigger: 'blur' } ],
  code:[ { required: true, message: '请填写百度统计获取的code', trigger: 'blur' } ],
  site_id:[ { required: true, message: '请填写百度统计站点id', trigger: 'blur' } ],
}
const labelCol = { style: { width: '100px' } }

// 获取百度统计code
const getBaiduCode = () => {
  const { appid } = ruleForm.value
  if (!appid) {
    message.error(rules.appid[0].message)
    return
  } 
  const redirect_uri = 'oob'
  const url = `http://openapi.baidu.com/oauth/2.0/authorize?response_type=code&client_id=${appid}&redirect_uri=${redirect_uri}&scope=basic&display=popup`
  window.open(url)
}

// 获取详情
const getDetail = async () => {
  const { data } = await SettingsApi.getBaiduConfig()
  if (data) {
    ruleForm.value = data
  }
}

const onSubmit = () => {
  formRef.value.validate().then(async () => {
    const rawValue = toRaw(ruleForm.value)
    await SettingsApi.saveBaiduConfig(rawValue)
    const { data } = await ReportApi.getBaiduToken(true)
    const msg = data.isRefresh ? '保存成功, 并刷新了百度access_token' : '保存成功'
    message.success(msg)
  })
  .catch((error: ValidateErrorEntity<BaiduConfig>) => {
    console.log('error', error);
  })
}

const resetForm = () => {
  formRef.value.resetFields();
}

onMounted(() => {
  getDetail()
})
</script>

<template>
  <div class="mail-settings">
    <a-alert
      message="百度统计需要昨日pv大于100的站点才能开启"
      description="前往百度统计管理->其他设置->数据导出服务进行开通"
      type="warning"
      show-icon
      style="margin-bottom: 15px"
    />
    <a-form ref="formRef" :model="ruleForm" :rules="rules" :label-col="labelCol">
      <a-form-item label="API Key"  name="appid">
        <a-input v-model:value="ruleForm.appid" placeholder="百度统计的API Key"></a-input>
      </a-form-item>

      <a-form-item label="Secret Key"  name="secret">
        <a-input v-model:value="ruleForm.secret" placeholder="百度统计的Secret Key"></a-input>
      </a-form-item>

      <a-form-item label="code"  name="code">
        <div style="display: flex">
          <a-input v-model:value="ruleForm.code" placeholder="百度统计获取的code"></a-input>
          <a-button @click="getBaiduCode" :disabled="!ruleForm.appid" type="primary" style="margin-left: 10px">点击获取code</a-button>
        </div>
        <span style="color: orange;">code需要先获取正确的API Key, code只能使用一次，如果发现数据不显示，请重新设置code</span>
      </a-form-item>

      <a-form-item label="站点id"  name="site_id">
        <a-input v-model:value="ruleForm.site_id" placeholder="百度统计站点id"></a-input>
        <span style="color: orange;">百度统计主页->查看报告->地址栏最后siteId=xxx就是站点id</span>
      </a-form-item>

      <a-form-item style="margin-left: 100px;">
        <a-button type="primary" @click="onSubmit">立即保存</a-button>
        <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
