<template>
  <yzp-draw v-model:visible="drawState" :title="id ? '编辑相册' : '添加相册'" @hide="closeDraw">
    <template #content>
      <a-spin class="center-spin" :spinning="wrapLoading" tip="加载中..."></a-spin>

      <a-form v-if="!wrapLoading" ref="formRef" :model="ruleForm" :rules="rules" :label-col="labelCol">
        
        <a-form-item label="图片" name="thumb_path">
          <yzp-upload v-model:value="ruleForm.thumb_path" :width="1366" thumb dir="picture"></yzp-upload>
        </a-form-item>

        <a-form-item label="分类" name="album_id">
          <a-select v-model:value="ruleForm.album_id" :options="albums" placeholder="请选择分类"></a-select>
        </a-form-item>

        <a-form-item label="标题" name="title">
          <a-input v-model:value="ruleForm.title" placeholder="填写相册标题" :maxlength="30"></a-input>
        </a-form-item>

        <a-form-item label="描述" name="description">
          <a-textarea v-model:value="ruleForm.description" :rows="3" placeholder="填写相册描述" :maxlength="100"></a-textarea>
        </a-form-item>

        <a-form-item label="设置">
          <a-checkbox v-model:checked="ruleForm.status">显示</a-checkbox>
          <a-checkbox v-model:checked="ruleForm.recommend">设为推荐</a-checkbox>
        </a-form-item>

      </a-form>
      </template>

      <template v-if="!wrapLoading" #footer>
        <a-button @click="closeDraw" style="flex: 1;margin-right: 10px;">取 消</a-button>
        <a-button type="primary" @click="onSubmit" style="flex: 1">{{ id ? '立即保存' : '立即添加' }}</a-button>
      </template>

  </yzp-draw>
</template>

<script lang="ts">
import { defineComponent, ref, watch, reactive, toRaw, computed } from 'vue'
import PictureApi from '@/api/picture'
import { useStore } from 'vuex'

export default defineComponent({

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: [String, Number],
      default: ''
    },
    albums: {
      type: Array,
      default: () => [] as Array<any>
    },
  },
  setup(props, { emit }) {

    const drawState = ref(false)
    const btnLoading = ref(false)
    const wrapLoading = ref(!!props.id)
    const formRef = ref()
    const initForm = {
      title: '',
      origin_path: '',
      thumb_path: '',
      description: '',
      album_id: undefined,
      recommend: false,
      status: true,
    }
    const ruleForm = ref({ ...initForm })

    const rules = reactive({
      title: [{ message: '标题必须', required: true, trigger: 'blur' }],
      thumb_path: [{ message: '图片必须', required: true, trigger: 'change' }],
      album_id: [{ message: '分类必须', required: true, trigger: 'change' }],
    })

    const store = useStore()
    const user: any = computed(() => store.state.user) 

    watch(() => props.visible, (val: boolean) => {
      drawState.value = val
      ruleForm.value = { ...initForm }
    })

    watch(() => props.id, (val: any) => {
      if (val) {
        getInfo(val)
      }
    })

    const getInfo = async (id: any) => {
      try {
        wrapLoading.value = true
        const { data } = await PictureApi.getDetail(id)
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
            const thumb = ruleForm.value.thumb_path
            const data = { 
              ...toRaw(ruleForm.value), 
              user_id: user.id,
              origin_path: thumb.replace('thumb_', 'origin_')
            }
            if (!props.id) {
              await PictureApi.create(data)
            } else {
              await PictureApi.update(props.id as any, data)
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