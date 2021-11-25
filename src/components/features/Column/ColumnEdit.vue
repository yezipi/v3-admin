<template>
  <a-form ref="formRef" :model="ruleForm" :rules="rules" :label-col="labelCol">
    <a-form-item label="栏目标题" name="name">
      <a-input v-model:value="ruleForm.name" auto-complete="off" placeholder="填写栏目标题"></a-input>
    </a-form-item>
    <a-form-item label="栏目url" name="url">
      <a-input v-model:value="ruleForm.url" auto-complete="off" placeholder="填写url名称，英文"></a-input>
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
    <a-form-item label="栏目内容" name="content" class="editor">
      <yzp-editor ref="editor" v-model="ruleForm.content"></yzp-editor>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import ColumnApi from '@/api/column'

export default defineComponent({

  props: {
    id: [Number, String]
  },

  setup(props) {

    const drawRef = ref()
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
    })

    const rules = {
      name: [{ message: '标题必须', required: true, trigger: 'blur' }],
      url: [{ message: '路径必修', required: true, trigger: 'blur' }],
      content: [{ message: '内容必须', required: true, trigger: 'blur' }],
    }

    const typeOptions = ref( [
      { label: '单页', value: 'single' },
    ])

    const getInfo = async () => {
      const { data } = await ColumnApi.getColumnDetail(props.id as any)
      const { type, name } = data
      ruleForm.value = data
      if (type !== 'single') {
        typeOptions.value = [{ label: name, value: type }]
      }
    }

    onMounted(() => getInfo())

    return {
      drawRef,
      formRef,
      ruleForm,
      typeOptions,
      rules,
      labelCol: { style: { width: '80px' } },
    }
  }
})
</script>