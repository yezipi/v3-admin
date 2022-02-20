<script lang="ts" setup>
import { ref, watch } from 'vue'
import ChangeLogsApi from '@/api/changeLogs'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  id: {
    type: [String, Number],
    default: ''
  }
})

const emit = defineEmits(['update:visible', 'finish'])

const drawState = ref(false)
const btnLoading = ref(false)
const wrapLoading = ref(!!props.id)
const formRef = ref()
const ruleForm = ref({
  content: '',
  version: '',
})
const labelCol = { style: { width: '100px' } }

// 检查版本号是否正确
const checkVersion = async (rule: any, val: any) => {
  const str = val ? String(val).split('.') : []
  if (str.length < 3) {
    return Promise.reject('版本类型不对，例如：1.0.1')
  }
}

const rules = {
  content: [{ message: '内容必须', required: true, trigger: 'blur' }],
  version: [{ trigger: 'blur', required: true, validator: checkVersion }],
}

watch(() => props.visible, (val: boolean) => {
  drawState.value = val
  ruleForm.value = {
    content: '',
    version: '',
  }
})

watch(() => props.id, (val: any) => {
  if (val) {
    getInfo(val)
  }
})

const getInfo = async (id: any) => {
  try {
    wrapLoading.value = true
    const { data } = await ChangeLogsApi.getDetail(id)
    ruleForm.value = data
  } catch (e) {
    console.log(e)
  } finally {
    wrapLoading.value = false
  }
}

const onSubmit = () => {
  formRef.value
    .validate()
    .then(async () => {
      btnLoading.value = true
      try {
        if (!props.id) {
          await ChangeLogsApi.create(ruleForm.value)
        } else {
          await ChangeLogsApi.update(props.id as any, ruleForm.value)
        }
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
    :title="id ? '编辑版本' : '添加版本'"
    :ok-loading="btnLoading"
    :wrap-loading="wrapLoading"
    @hide="closeDraw"
    @confirm="onSubmit"
  >
    <template #content>
      <a-form ref="formRef" :model="ruleForm" :rules="rules" :label-col="labelCol">
        <a-form-item label="版本号" name="version">
          <a-input v-model:value="ruleForm.version" placeholder="请填写版本号"  :maxlength="20" style="width: 100%"></a-input>
        </a-form-item>
        <a-form-item label="更新内容" name="content">
          <a-textarea v-model:value="ruleForm.content" :rows="5" placeholder="请填写更新内容"></a-textarea>
        </a-form-item>
      </a-form>
    </template>
  </yzp-draw>
</template>