<template>
  <div class="edit-page">
    <a-page-header :title="pageTitle" style="padding-top: 0;" />
    <a-form ref="formRef" :model="ruleForm" :rules="rules" :label-col="labelCol">
      <a-form-item label="栏目标题" name="name">
        <a-input v-model:value="ruleForm.name" :maxlength="10" placeholder="填写栏目标题"></a-input>
      </a-form-item>

      <a-form-item label="栏目url" name="url">
        <a-input v-model:value="ruleForm.url" :maxlength="10" autocomplete="off" placeholder="填写url名称，英文"></a-input>
      </a-form-item>

      <a-form-item label="栏目类型">
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

      <a-form-item label="栏目排序" name="sort">
        <a-input v-model:value="ruleForm.sort" type="number" placeholder="填写栏目排序"></a-input>
      </a-form-item>

      <a-form-item label="关键词">
        <a-input v-model:value="ruleForm.keywords" placeholder="填写关键词"></a-input>
      </a-form-item>

      <a-form-item label="栏目描述">
        <a-textarea v-model:value="ruleForm.description" rows="3" placeholder="填写栏目描述"></a-textarea>
      </a-form-item>

      <a-form-item label="栏目内容" name="content" class="maxwidth-100">
        <yzp-editor ref="editor" v-model="ruleForm.content"></yzp-editor>
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
import { useRoute, useRouter } from 'vue-router'
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
      content: '',
      column_id: undefined,
      can_delete: true
    })

    const rules = {
      name: [{ message: '标题必须', required: true, trigger: 'blur' }],
      url: [{ message: '路径必须', required: true, trigger: 'blur' }],
      content: [{ message: '内容必须', required: true, trigger: 'blur' }],
    }

    const typeOptions = ref([
      { label: '单页', value: 'single' },
    ])

    const router = useRouter()
    const route = useRoute()
    const isAddPage = route.name === 'ColumnAdd'
    const pageTitle = ref()

    const { id } = route.query

    const getInfo = async () => {
      if (id) {
        const { data } = await ColumnApi.getColumnDetail(id as any)
        const { type, name } = data
        if (!isAddPage) {
          ruleForm.value = data
        }
        if (type !== 'single') {
          typeOptions.value = [{ label: DICT.COLUMN_TYPE[type as ColumnType], value: type }]
        }
        pageTitle.value = isAddPage ? `添加栏目` : `编辑${name}栏目`
        document.title = pageTitle.value
      }
    }

    const onSubmit = () => {
      formRef.value
        .validate()
        .then(async () => {
          if (!id) {
            await ColumnApi.createColumn(ruleForm.value)
          } else {
            await ColumnApi.updateColumn(id, ruleForm.value)
          }
          setTimeout(() => {
            router.go(-1)
          }, 1500)
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