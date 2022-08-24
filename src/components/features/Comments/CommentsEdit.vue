<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'
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
  status: 1,
  notice: false,
  sort: 100,
  reason: '',
  recommend: false,
}

const drawState = ref(false)
const btnLoading = ref(false)
const wrapLoading = ref(!!props.id)
const formRef = ref()
const ruleForm = ref({ ...initForm })
const labelCol = { style: { width: '100px' } }
const drawTitle = ref('')

const rules: Record<string, Rule[]> = reactive<any>({
  nickname: [{ message: '名称必须', required: true, trigger: 'blur' }],
  site: [{ message: '站点必须', required: false, trigger: 'blur' }]
})

watch(() => props.visible, (val: boolean) => {
  drawState.value = val
  if (!props.id) {
    ruleForm.value = { ...initForm }
  }
  if (props.type === 'blogroll') {
    rules.site[0].required = true
  }
  if (props.id && val) {
    getInfo(props.id)
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
  if (ruleForm.value.site && props.type === 'blogroll') {
    ruleForm.value.avatar = `${ruleForm.value.site}/favicon.ico`
  }
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
  <yzp-draw
    v-model:visible="drawState"
    :title="drawTitle"
    :ok-loading="btnLoading"
    :wrap-loading="wrapLoading"
    @hide="closeDraw"
    @confirm="onSubmit"
  >
    <template #content>
      <a-form
        ref="formRef"
        :model="ruleForm"
        :rules="rules"
        :label-col="labelCol"
      >

        <a-form-item v-if="type !== 'blogroll' || id" label="头像">
          <div class="comments-avatar">
            <yzp-upload v-if="type !== 'blogroll'" v-model:value="ruleForm.avatar" :width="100" :height="100" clip withParentWith dir="blogroll"></yzp-upload>
            <img v-if="ruleForm.site" :src="`${ruleForm.site}/favicon.ico`" />
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

        <a-form-item v-if="ruleForm.address" label="地址">
          <a-input v-model:value="ruleForm.address" :disabled="!!id" autocomplete="off" placeholder="请填写地址"></a-input>
        </a-form-item>

        <a-form-item v-if="ruleForm.reason" label="申请理由" name="content">
          <a-textarea v-model:value="ruleForm.reason" :rows="3" placeholder="请填写申请理由"></a-textarea>
        </a-form-item>

        <a-form-item label="站点描述" name="content">
          <a-textarea v-model:value="ruleForm.content" :rows="3" placeholder="请填写站点描述，不填写则自动抓取"></a-textarea>
        </a-form-item>

        <a-form-item label="回复">
          <a-textarea v-model:value="ruleForm.reply_content" :rows="3" placeholder="请填写内容"></a-textarea>
          <div style="margin-top: 10px;color: #e79519">填写了回复和邮箱内容才可以发送邮件</div>
        </a-form-item>

        <a-form-item label="显示">
          <a-switch v-model:checked="ruleForm.status" :checked-value="1" :un-checked-value="0" ></a-switch>
        </a-form-item>
        
        <a-form-item label="推荐">
          <a-switch v-model:checked="ruleForm.recommend"></a-switch>
        </a-form-item>

        <a-form-item label="设置">
          <a-checkbox v-model:checked="ruleForm.notice" :disabled="!ruleForm.email || !ruleForm.reply_content">邮件通知TA</a-checkbox>
        </a-form-item>
        
      </a-form>
    </template>
  </yzp-draw>
</template>

<style scoped>
.comments-avatar {
  width: 100px;height: 100px;background: #999999;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
</style>