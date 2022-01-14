<script lang="ts" setup>
import { ref, watch } from 'vue'
import ReportApi from '@/api/report'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  id: {
    type: [String, Number],
    default: ''
  },
  // 类型，blogroll, comment, feedback
  type: {
    type: String,
    default: 'comment'
  },
  title: {
    type: String,
    default: ''
  },
  // 接口对象
  api: {
    type: Object,
    default: () => {},
    required: true
  }
})
const emit = defineEmits(['update:visible', 'finish'])

const { api, type, id, title } = props

const initForm = {
  nickname: '',
  avatar: '',
  province: '',
  city: '',
  district: '',
  address: '',
  lat: '',
  lng: '',
  ip: '',
  ua: '',
  site: '',
  email: '',
  content: '',
  reply_content: '',
  reply_time: new Date().getTime(),
  article_id: undefined,
  type,
  nofollow: true,
  status: false,
  notice: false,
  sort: 100,
}

const drawState = ref(false)
const btnLoading = ref(false)
const wrapLoading = ref(!!props.id)
const formRef = ref()
const ruleForm = ref({ ...initForm })
const labelCol = { style: { width: '100px' } }
const drawTitle = ref('')

const rules = ref<any>({
  nickname: [{ message: '名称必须', required: true, trigger: 'blur' }],
  content: [{ message: '内容必须', required: true, trigger: 'blur' }]
})

if (props.type === 'blogroll') {
  rules.site = [{ message: '站点必须', required: true, trigger: 'blur' }]
}

watch(() => props.visible, (val: boolean) => {
  drawState.value = val
  if (!props.id) {
    ruleForm.value = { ...initForm }
  }
})

watch(() => props.id, (val: any) => {
  if (val) {
    getInfo(val)
  }
})

drawTitle.value = props.id ? `编辑${title}` : `添加${title}`

const getInfo = async (id: any) => {
  try {
    wrapLoading.value = true
    const { data } = await api.getDetail(id)
    ruleForm.value = data
  } catch (e) {
    console.log(e)
  } finally {
    wrapLoading.value = false
  }
}

const onSubmit = () => {
  formRef.value.validate().then(async () => {
    btnLoading.value = true
    try {
      if (!props.id) {
        await api.create(ruleForm.value)
      } else {
        await api.update(props.id as any, ruleForm.value)
      }
      ReportApi.getUnAudit()
      closeDraw()
      emit('finish', true)
    } catch (e) {
      console.log(e)
    } finally {
      btnLoading.value = false
    }
  })
}

const closeDraw = () => {
  drawState.value = false
  emit('update:visible', false)
}
</script>

<template>
  <yzp-draw v-model:visible="drawState" :title="drawTitle" @hide="closeDraw">
    <template #content>
      <a-spin class="center-spin" :spinning="wrapLoading" tip="加载中..."></a-spin>
      <a-form
        v-if="!wrapLoading"
        ref="formRef"
        :model="ruleForm"
        :rules="rules"
        :label-col="labelCol"
      >

        <a-form-item label="头像">
          <div style="width: 100px;height: 100px;">
            <yzp-upload v-model:value="ruleForm.avatar" :width="100" :height="100" clip withParentWith dir="blogroll"></yzp-upload>
          </div>
        </a-form-item>

        <a-form-item label="名称" name="nickname">
          <a-input v-model:value="ruleForm.nickname" :maxlength="20" placeholder="请填写名称"></a-input>
        </a-form-item>

        <a-form-item label="站点" name="site">
          <a-input v-model:value="ruleForm.site" placeholder="请填写站点网址"></a-input>
        </a-form-item>

        <a-form-item label="邮箱">
          <a-input v-model:value="ruleForm.email" placeholder="请填写邮箱"></a-input>
        </a-form-item>

        <a-form-item v-if="id" label="省市区">
          <span>{{ ruleForm.province + ruleForm.city + ruleForm.district }}</span>
        </a-form-item>

        <a-form-item v-if="id" label="ip">
          <span>{{ ruleForm.ip }}</span>
        </a-form-item>

        <a-form-item v-if="id" label="终端">
          <span>{{ ruleForm.ua }}</span>
        </a-form-item>

        <a-form-item label="地址">
          <a-input v-model:value="ruleForm.address" :disabled="!!id" autocomplete="off" placeholder="请填写地址"></a-input>
        </a-form-item>

        <a-form-item label="内容" name="content">
          <a-textarea v-model:value="ruleForm.content" :rows="3" placeholder="请填写内容"></a-textarea>
        </a-form-item>

        <a-form-item label="回复">
          <a-textarea v-model:value="ruleForm.reply_content" :rows="3" placeholder="请填写内容"></a-textarea>
        </a-form-item>

        <a-form-item label="设置">
          <a-checkbox v-model:checked="ruleForm.status">显示</a-checkbox>
          <a-checkbox v-model:checked="ruleForm.notice" :disabled="!ruleForm.email">邮件通知TA</a-checkbox>
        </a-form-item>
        
      </a-form>
    </template>
    <template v-if="!wrapLoading" #footer>
      <a-button style="flex: 1;margin-right: 10px" @click="closeDraw">取消</a-button>
      <a-button
        :loading="btnLoading"
        style="flex: 1"
        type="primary"
        @click="onSubmit"
      >{{ props.id ? '立即保存' : '立即添加' }}</a-button>
    </template>
  </yzp-draw>
</template>