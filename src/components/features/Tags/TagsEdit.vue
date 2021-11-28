<template>
  <yzp-draw v-model:visible="drawState" :title="id ? '编辑标签' : '添加标签'" @hide="closeDraw">
    <template #content>
      <a-spin class="center-spin" :spinning="wrapLoading" tip="加载中..."></a-spin>
      <a-form v-show="!wrapLoading" ref="formRef" :model="ruleForm" :rules="rules" :label-col="labelCol">
        <a-form-item label="名称" name="name">
          <a-input v-model:value="ruleForm.name" autocomplete="off" :maxlength="20" placeholder="请填写标签名称"></a-input>
        </a-form-item>

        <a-form-item label="排序" name="sort">
          <a-input-number v-model:value="ruleForm.sort" placeholder="请填写标签排序" style="width: 100%"></a-input-number>
        </a-form-item>
      </a-form>
    </template>
    <template #footer>
      <div v-show="!wrapLoading" style="display: flex;flex: 1">
        <a-button :loading="btnLoading" style="flex: 1" type="primary" @click="onSubmit">{{ id ? '立即保存' : '立即添加' }}</a-button>
        <a-button style="flex: 1;margin-left: 10px" @click="closeDraw">取消</a-button>
      </div>
    </template>
  </yzp-draw>
</template>

<script lang="ts">
import { defineComponent, ref, watch, reactive, nextTick } from 'vue'
import TagsApi from '@/api/tags'

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
      name: '',
      sort: 100,
    })

    const rules = reactive({
      name: [{ message: '账号必须', required: true, trigger: 'blur' }],
    })

    watch(() => props.visible, (val: boolean) => {
      drawState.value = val
    })

    watch(() => props.id, (val: any) => {
      if (val) {
        getInfo(val)
      } else {
        wrapLoading.value = false
        nextTick(() => {
          ruleForm.value = {
            name: '',
            sort: 100,
          }
        })
      }
    })

    const getInfo = async (id: any) => {
      try {
        wrapLoading.value = true
        const { data } = await TagsApi.getDetail(id)
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
              await TagsApi.create(ruleForm.value)
            } else {
              await TagsApi.update(props.id as any, ruleForm.value)
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