<template>
  <div class="edit-page">
    <a-page-header :title="pageTitle" style="padding-top: 0;" />
    <a-form ref="formRef" :model="ruleForm" :rules="rules" :label-col="labelCol">
      <a-form-item label="名称" name="name">
        <a-input v-model:value="ruleForm.name" auto-complete="off" placeholder="填写栏目标题"></a-input>
      </a-form-item>

      <a-form-item label="url" name="url">
        <a-input v-model:value="ruleForm.url" auto-complete="off" placeholder="填写url名称，英文"></a-input>
      </a-form-item>

      <a-form-item label="类型">
        <a-select v-model:value="ruleForm.type" :options="typeOptions"></a-select>
      </a-form-item>

      <a-form-item label="打开方式">
        <a-radio-group v-model:value="ruleForm.new_window">
          <a-radio :value="false">原窗口</a-radio>
          <a-radio :value="true">新窗口</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="是否显示">
        <a-switch v-model:checked="ruleForm.status"></a-switch>
      </a-form-item>

      <a-form-item label="排序" name="sort">
        <a-input v-model:value="ruleForm.sort" type="number" placeholder="填写排序"></a-input>
      </a-form-item>

      <a-form-item label="关键词">
        <a-input v-model:value="ruleForm.keywords" placeholder="填写关键词"></a-input>
      </a-form-item>

      <a-form-item label="描述">
        <a-textarea v-model:value="ruleForm.description" :rows="3" placeholder="填写描述"></a-textarea>
      </a-form-item>

      <a-form-item class="btn-label">
        <a-button type="primary" @click="onSubmit">{{ id ? '立即保存' : '立即添加' }}</a-button>
        <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface'
import { useRoute, useRouter } from 'vue-router'
import type { Rule } from 'ant-design-vue/es/form'
import ColumnApi from '@/api/column'
import DICT, { ColumnType } from '@/dict/index'

export default defineComponent({

  setup() {

    const formRef = ref()
    const ruleForm = ref({
      name: '',
      url: '',
      type: 'single',
      new_window: false,
      status: true,
      sort: 100,
      keywords: '',
      description: '',
      column_id: undefined,
      can_delete: true
    })

    const rules: Record<string, Rule[]> = {
      name: [{ message: '标题必须', required: true, trigger: 'blur' }],
      url: [{ message: '路径必须', required: true, trigger: 'blur' }],
    }

    const typeOptions = ref<any>([])

    const router = useRouter()
    const route = useRoute()
    const pageTitle = ref()

    const { column_id, id } = route.query

    const getInfo = async () => {
      if (!id && column_id) {
        const { data } = await ColumnApi.getColumnDetail(column_id)
        const { type, name } = data
        ruleForm.value.column_id = column_id as any
        ruleForm.value.type = type
        typeOptions.value = [{ label: DICT.COLUMN_TYPE[type as ColumnType], value: type }]
        pageTitle.value = `添加${name}子栏目`
      }
      if (id) {
        const { data } = await ColumnApi.getSubColumnDetail(id)
        const { type, name } = data
        ruleForm.value = data
        typeOptions.value = [{ label: DICT.COLUMN_TYPE[type as ColumnType], value: type }]
        pageTitle.value = `编辑${name}`
      }
      document.title = pageTitle.value
    }

    const onSubmit = () => {
      formRef.value
        .validate()
        .then(async () => {
          if (!id) {
            await ColumnApi.createSubColumn(ruleForm.value)
          } else {
            await ColumnApi.updateSubColumn(id, ruleForm.value)
          }
          setTimeout(() => {
            router.go(-1)
          }, 1500)
        })
        .catch((error: ValidateErrorEntity) => {
          console.log('error', error)
        })
    }

    const resetForm = () => {
      formRef.value.resetFields()
    }

    onMounted(() => getInfo())

    return {
      formRef,
      ruleForm,
      typeOptions,
      rules,
      labelCol: { style: { width: '100px' } },
      id,
      onSubmit,
      resetForm,
      pageTitle,
    }
  }
})
</script>