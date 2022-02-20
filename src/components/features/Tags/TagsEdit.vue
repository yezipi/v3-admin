<script lang="ts" setup>
import { ref, watch } from 'vue'
import TagsApi from '@/api/tags'

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
  name: '',
  sort: 100,
})
const labelCol = { style: { width: '100px' } }

const rules = {
  name: [{ message: '名称必须', required: true, trigger: 'blur' }],
  cover: [{ message: '封面必须', required: true, trigger: 'change' }],
}

watch(() => props.visible, (val: boolean) => {
  drawState.value = val
  ruleForm.value = {
    name: '',
    sort: 100,
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
    const { data } = await TagsApi.getDetail(id)
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
          await TagsApi.create(ruleForm.value)
        } else {
          await TagsApi.update(props.id as any, ruleForm.value)
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
    :title="id ? '编辑标签' : '添加标签'"
    :ok-loading="btnLoading"
    :wrap-loading="wrapLoading"
    @hide="closeDraw"
    @confirm="onSubmit"
  >
    <template #content>
      <a-form ref="formRef" :model="ruleForm" :rules="rules" :label-col="labelCol">
        <a-form-item label="名称" name="name">
          <a-input v-model:value="ruleForm.name" autocomplete="off" :maxlength="20" placeholder="请填写标签名称"></a-input>
        </a-form-item>

        <a-form-item label="排序" name="sort">
          <a-input-number v-model:value="ruleForm.sort" placeholder="请填写标签排序" style="width: 100%"></a-input-number>
        </a-form-item>
      </a-form>
    </template>
  </yzp-draw>
</template>