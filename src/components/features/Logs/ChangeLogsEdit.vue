<script lang="ts" setup>
import { ref, watch } from 'vue'
import ChangeLogsApi from '@/api/changeLogs'

type LogTypeConfig = 'add' | 'fix' | 'update' | 'delete'

interface LogItemConfig {
  type: string,
  text: string
}

interface LogFormCOnfig {
  version: string,
  content: Array<LogItemConfig>
}

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

const logsType = [
  { label: '新增', value: 'add' },
  { label: '修复', value: 'fix' },
  { label: '更新', value: 'update' },
  { label: '删除', value: 'delete' }
]

const drawState = ref(false)
const btnLoading = ref(false)
const wrapLoading = ref(!!props.id)
const formRef = ref()
const ruleForm = ref<LogFormCOnfig>({
  content: [],
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
    content: [],
    version: '',
  }
  if (val && props.id) {
    getInfo(props.id)
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

const onSubmit = async () => {
  await formRef.value.validate()
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
}

const addLog = () => {
  ruleForm.value.content.push({
    type: 'add',
    text: '',
  })
}

const delLog = (index: number) => {
  ruleForm.value.content.splice(index, 1)
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
          <!-- <a-textarea v-model:value="ruleForm.content" :rows="5" placeholder="请填写更新内容"></a-textarea> -->
          <div class="yzp-logs-add">
            <div v-for="(item, index) in ruleForm.content" :index="index" class="yzp-logs-item">
              <a-input-group compact style="display: flex;flex: 1;margin-right: 15px;" >
                <a-form-item style="margin-bottom: 0;">
                  <a-select v-model:value="item.type" :options="logsType"></a-select>
                </a-form-item>
                <a-form-item style="margin-bottom: 0;flex: 1">
                  <a-input v-model:value="item.text" placeholder="请输入更新内容"/>
                </a-form-item>
              </a-input-group>
              <a-button danger size="small" type="text" @click="delLog(index)" style="flex-shrink: 0;">删除</a-button>
            </div>
          </div>
          <a-button type="primary" @click="addLog">添加</a-button>
        </a-form-item>
      </a-form>
    </template>
  </yzp-draw>
</template>

<style scoped lang="less">
.yzp-logs-add {
  .yzp-logs-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
  }
}
</style>