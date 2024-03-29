<template>
  <div class="article-form">
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="labelCol"
    >
      
      <a-form-item label="内容" name="content">
        <a-textarea ref="textareaRef" v-model:value="formState.content" :rows="5" placeholder="说点什么吧"></a-textarea>
        <div style="position: relative">
          <img class="face-btn" src="/src/assets/img/icon_face.png" @click.stop="faceVisible = true" />
          <yzp-face v-if="faceVisible" v-model:value="faceVisible" @change="onFaceChange" />
        </div>
      </a-form-item>

      <a-form-item label="图片">
        <yzp-upload v-model:value="formState.images" dir="mood" thumb compress multiple watermark :count="9" />
      </a-form-item>
      
      <a-form-item label="浏览">
        <a-input-number v-model:value="formState.view" placeholder="请输入浏览数" style="width: 100%" />
      </a-form-item>

      <a-form-item label="设置">
        <a-checkbox v-model:checked="formState.status">显示</a-checkbox>
        <a-checkbox v-model:checked="formState.open_comment">开启评论</a-checkbox>
      </a-form-item>
      
      <a-form-item class="btn-label">
        <a-button type="primary" @click="onSubmit">{{ id ? '立即保存' : '立即发布' }}</a-button>
        <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
      </a-form-item>

    </a-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRaw, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import type { Rule } from 'ant-design-vue/es/form'
import MoodApi from '@/api/mood'

export default defineComponent({

  setup(props) {
    const formRef = ref()
    const textareaRef = ref()

    let formState= ref({
      content: '',
      images: undefined,
      view: 0,
      status: true,
      open_comment: true,
    })

    const rules: Record<string, Rule[]> = {
      content: [
        { required: true, message: '请输入正文内容', trigger: 'change' },
        { min: 5, message: '正文至少5个字哦', trigger: 'change' },
      ],
    };

    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const id = route.query.id
    const user: any = computed(() => store.state.user)
    const faceVisible = ref(false)

    // 获取详情
    const getDetail = async () => {
      if (!id) {
        return
      }
      const { data } = await MoodApi.getDetail(id)
      formState.value = data
      formState.value.images = data.images.map((e: any, index: number) => {
        const strs = e.split('/')
        return {
          uid: index,
          url: e,
          name: strs[strs.length - 1],
          status: 'done'
        }
      })
    }

    const onSubmit = () => {
      formRef.value
        .validate()
        .then(async () => {
          const data = { ...toRaw(formState.value), user_id: user.id }
          if (!id) {
            await MoodApi.create(data)
          } else {
            await MoodApi.update(id, data)
          }
         setTimeout(() => {
            router.push({ name: 'MoodList' })
          }, 1200)
        })
    }

    const resetForm = () => {
      formRef.value.resetFields();
    }

    const onFaceChange = (res: any) => {
      textareaRef.value.focus()
      formState.value.content += res.alias
    }

    onMounted(() => {
      getDetail()
    })

    return {
      formRef,
      textareaRef,
      labelCol: { style: { width: '100px' } },
      formState,
      rules,
      id,
      faceVisible,
      onFaceChange,
      onSubmit,
      resetForm,
    }
  },
})
</script>

<style lang="less" scoped>
.face-btn {
  width: 30px;
  cursor: pointer;
  margin-top: 5px;
}
</style>