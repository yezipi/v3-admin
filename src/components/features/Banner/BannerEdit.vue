<template>
  <yzp-draw v-model:visible="drawState" :title="id ? '编辑用户' : '添加用户'" @hide="closeDraw">
    <template #content>
      <a-spin :spinning="wrapLoading" tip="加载中..."></a-spin>
      <a-form v-show="!wrapLoading" ref="formRef" :model="ruleForm" :rules="rules" :label-col="labelCol">
        <a-form-item label="封面" name="cover">
          <div style="width:150px;height:71px">
            <yzp-upload
              v-model:value="ruleForm.cover"
              :clip="true"
              :width="525"
              :height="250"
              :withParentWith="true"
              dir="banner"
            >
            </yzp-upload>
          </div>
        </a-form-item>

        <a-form-item label="名称" name="name">
          <a-input v-model:value="ruleForm.name" autocomplete="off" :maxlength="20" placeholder="请填写名称"></a-input>
        </a-form-item>

        <a-form-item label="排序" name="sort">
          <a-input-number v-model:value="ruleForm.sort" autocomplete="off" placeholder="请填写序号" style="width: 100%"></a-input-number>
        </a-form-item>

        <a-form-item label="类型" name="role">
          <a-radio-group v-model:value="ruleForm.type" @change="onTypeChange">
            <a-radio :value="1">文章</a-radio>
            <a-radio :value="2">案例</a-radio>
            <a-radio :value="3">链接</a-radio>
            <a-radio :value="0">不跳转</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item v-if="ruleForm.type === 3" label="链接" name="url">
          <a-input v-model:value="ruleForm.url" autocomplete="off" placeholder="请填写跳转链接"></a-input>
        </a-form-item>

        <a-form-item v-if="ruleForm.type === 1" label="文章" name="target">
          <article-search v-model:value="ruleForm.target" autoLoad type="article"></article-search>
        </a-form-item>

        <a-form-item v-if="ruleForm.type === 2" label="案例" name="target">
          <article-search v-model:value="ruleForm.target" autoLoad type="case"></article-search>
        </a-form-item>

        <a-form-item label="状态" name="status">
          <a-switch v-model:checked="ruleForm.status"></a-switch>
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
import BannerApi from '@/api/banner'

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
      cover: '',
      type: 1,
      status: true,
      target: undefined as any, // 1文章，2案例，3外部url, 0不跳转
      sort: 100,
      url: undefined,
    })

    const checkUrl = async (rule: any) => {
      if (ruleForm.value.type !== 0 && !ruleForm.value[rule.field as keyof typeof ruleForm.value]) {
        return Promise.reject(rule.message)
      }
    }

    const checkTarget = async (rule: any) => {
      if (ruleForm.value.type === 3 && !ruleForm.value[rule.field as keyof typeof ruleForm.value]) {
        return Promise.reject(rule.message)
      }
    }

    const rules = reactive({
      name: [{ message: '名称必须', required: true, trigger: 'blur' }],
      cover: [{ message: '封面必须', required: true, trigger: 'blur' }],
      url: [{ message: '链接必须', required: true, trigger: 'blur', validator: checkUrl }],
      target: [{ message: '目标必须', required: true, trigger: 'blur', validator: checkTarget }],
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
          restFrom()
        })
      }
    })

    const restFrom = () => {
      ruleForm.value = {
        name: '',
        cover: '',
        type: 1,
        status: true,
        target: undefined,
        url: undefined,
        sort: 100,
      }
    }

    const getInfo = async (id: any) => {
      try {
        wrapLoading.value = true
        const { data } = await BannerApi.getDetail(id)
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
              await BannerApi.create(ruleForm.value)
            } else {
              await BannerApi.update(props.id as any, ruleForm.value)
            }
            closeDraw()
            emit('finish', true)
          } catch (e) {

          } finally {
            btnLoading.value = false
          }
        })
    }

    const closeDraw = () => {
      restFrom()
      drawState.value = false
      emit('update:visible', false)
    }

    const onTypeChange = (res: any) => {
      ruleForm.value.target = undefined
      if (res.target.value !== 3) {
        ruleForm.value.target = undefined
      }
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
      onTypeChange,
    }
  }
})
</script>