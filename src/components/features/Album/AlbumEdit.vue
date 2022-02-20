<script lang="ts" setup>
import { ref, watch, reactive, toRaw, computed } from 'vue'
import AlbumApi from '@/api/album'
import { useStore } from 'vuex'

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
const initForm = {
  title: '',
  cover: '',
  description: '',
  open_comment: true,
  recommend: false,
  status: true,
  lock: false,
  password: '',
}
const ruleForm = ref({ ...initForm })
const labelCol = { style: { width: '100px' } }

const checkPassword = async (rule: any, val: string) => {
  if (ruleForm.value.lock && !val) {
    return Promise.reject('设置为私密后需要设置密码')
  }
}

const rules = reactive({
  title: [{ message: '标题必须', required: true, trigger: 'blur' }],
  cover: [{ message: '封面必须', required: true, trigger: 'change' }],
  password: [{ trigger: 'blur', validator: checkPassword }],
})

const store = useStore()
const user: any = computed(() => store.state.user)

watch(() => props.visible, (val: boolean) => {
  drawState.value = val
  if (!props.id) {
    ruleForm.value = { ...initForm }
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
    const { data } = await AlbumApi.getDetail(id)
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
      const data = { ...toRaw(ruleForm.value), user_id: user.id }
      if (!props.id) {
        await AlbumApi.create(data)
      } else {
        await AlbumApi.update(props.id as any, data)
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
        :rules="rules"
        :label-col="labelCol"
      >
        <a-form-item label="图片" name="cover">
          <div style="width: 180px;height:120px">
            <yzp-upload
              v-model:value="ruleForm.cover"
              :width="360"
              :height="240"
              withParentWith
              clip
              dir="album"
            ></yzp-upload>
          </div>
        </a-form-item>

        <a-form-item label="标题" name="title">
          <a-input v-model:value="ruleForm.title" placeholder="填写相册标题" :maxlength="30"></a-input>
        </a-form-item>

        <a-form-item label="描述" name="description">
          <a-textarea
            v-model:value="ruleForm.description"
            :rows="3"
            placeholder="填写相册描述"
            :maxlength="100"
          ></a-textarea>
        </a-form-item>

        <a-form-item label="设为私密" name="lock">
          <a-switch v-model:checked="ruleForm.lock"></a-switch>
        </a-form-item>

        <a-form-item v-if="ruleForm.lock" label="密码" name="password">
          <a-input
            v-model:value="ruleForm.password"
            :placeholder="id ? '为空则不修改' : '请输入密码'"
            :maxlength="100"
          ></a-input>
        </a-form-item>

        <a-form-item label="设置">
          <a-checkbox v-model:checked="ruleForm.status">显示</a-checkbox>
          <a-checkbox v-model:checked="ruleForm.open_comment">开启评论</a-checkbox>
          <a-checkbox v-model:checked="ruleForm.recommend">设为推荐</a-checkbox>
        </a-form-item>
      </a-form>
    </template>
  </yzp-draw>
</template>