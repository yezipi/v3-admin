<script lang="ts" setup>
import { ref, watch, reactive, toRaw, computed } from 'vue'
import PictureApi from '@/api/picture'
import { useStore } from 'vuex'
import type { Rule } from 'ant-design-vue/es/form'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  id: {
    type: [String, Number],
    default: ''
  },
  album_id: {
    type: [String, Number],
    default: ''
  },
  albums: {
    type: Array,
    default: () => [] as Array<any>
  },
})
const emit = defineEmits(['update:visible', 'finish'])
const labelCol = { style: { width: '100px' } }
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

const rules: Record<string, Rule[]> = reactive({
  title: [{ message: '标题必须', required: true, trigger: 'blur' }],
  thumb_path: [{ message: '图片必须', required: true, trigger: 'blur' }],
  album_id: [{ message: '分类必须', required: true, trigger: 'change' }],
})

const store = useStore()
const user: any = computed(() => store.state.user)

watch(() => props.visible, (val: boolean) => {
  drawState.value = val
  if (!props.id) {
    ruleForm.value = { ...initForm }
  }
  if (props.album_id) {
    ruleForm.value.album_id = props.album_id as any
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
    const { data } = await PictureApi.getDetail(id)
    data.album_id = String(data.album_id)
    ruleForm.value = data
  } catch (e) {
    console.log(e)
  } finally {
    wrapLoading.value = false
  }
}

const onSubmit = () => {
  formRef.value.validate().then(async () => {
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
    :title="id ? '编辑相册' : '添加相册'"
    :ok-loading="btnLoading"
    :wrap-loading="wrapLoading"
    @hide="closeDraw"
    @confirm="onSubmit"
  >
    <template #content>
      <a-form
        ref="formRef"
        :model="ruleForm"
        :rules="(rules as any)"
        :label-col="labelCol"
      >
        <a-form-item label="图片" name="thumb_path">
          <yzp-upload v-model:value="ruleForm.thumb_path" :width="1366" thumb watermark dir="picture"></yzp-upload>
        </a-form-item>

        <a-form-item label="分类" name="album_id">
          <a-select v-model:value="ruleForm.album_id" :options="albums as any" placeholder="请选择分类"></a-select>
        </a-form-item>

        <a-form-item label="标题" name="title">
          <a-input v-model:value="ruleForm.title" autocomplete="off" placeholder="填写相册标题" :maxlength="30" />
        </a-form-item>

        <a-form-item label="描述" name="description">
          <a-textarea
            v-model:value="ruleForm.description"
            :rows="3"
            placeholder="填写相册描述"
            :maxlength="100"
          />
        </a-form-item>

        <a-form-item label="设置">
          <a-checkbox v-model:checked="ruleForm.status">显示</a-checkbox>
          <a-checkbox v-model:checked="ruleForm.recommend">设为推荐</a-checkbox>
        </a-form-item>
      </a-form>
    </template>
  </yzp-draw>
</template>