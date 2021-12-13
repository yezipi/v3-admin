<template>
  <yzp-draw v-model:visible="drawState" :title="id ? '编辑版本' : '添加版本'" @hide="closeDraw">
    <template #content>
      <a-spin class="center-spin" :spinning="wrapLoading" tip="加载中..."></a-spin>
      <a-form v-if="!wrapLoading" ref="formRef" :model="ruleForm" :rules="rules" :label-col="labelCol">
        <a-form-item label="版本号" name="version">
          <a-input v-model:value="ruleForm.version" placeholder="请填写版本号"  :maxlength="20" style="width: 100%"></a-input>
        </a-form-item>
        <a-form-item label="更新内容" name="content">
          <a-textarea v-model:value="ruleForm.content" :rows="5" placeholder="请填写更新内容"></a-textarea>
        </a-form-item>
      </a-form>
    </template>
    <template v-if="!wrapLoading" #footer>
      <a-button style="flex: 1;margin-right: 10px" @click="closeDraw">取消</a-button>
      <a-button :loading="btnLoading" style="flex: 1" type="primary" @click="onSubmit">{{ id ? '立即保存' : '立即添加' }}</a-button>
    </template>
  </yzp-draw>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import ChangeLogsApi from '@/api/changeLogs'

export default defineComponent({

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: [String, Number],
      default: ''
    }
  },
  setup(props, { emit }) {

    const drawState = ref(false)
    const btnLoading = ref(false)
    const wrapLoading = ref(!!props.id)
    const formRef = ref()
    const ruleForm = ref({
      content: '',
      version: '',
    })

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
      } catch(e) {
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
          } catch(e) {
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

    return {
      formRef,
      ruleForm,
      rules,
      labelCol: { style: { width: '100px' } },
      drawState,
      btnLoading,
      wrapLoading,
      onSubmit,
      closeDraw,
    }
  }
})
</script>