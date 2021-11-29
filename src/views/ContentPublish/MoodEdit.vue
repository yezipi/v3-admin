<template>
  <div class="article-form">
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="labelCol"
    >
      
      <a-form-item label="内容" name="content" class="maxwidth-100">
        <yzp-editor ref="editor" v-model="formState.content"></yzp-editor>
      </a-form-item>

      <a-form-item label="来源">
        <a-input v-model:value="formState.author_name" placeholder="请输入来源" />
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
import MoodApi from '@/api/mood'

export default defineComponent({

  setup(props) {
    const formRef = ref();

    let formState= ref({
      content: '',
      author_name: '',
      view: 0,
      status: true,
      open_comment: true,
    })

    const rules = {
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

    // 获取详情
    const getDetail = async () => {
      if (!id) {
        return
      }
      const { data } = await MoodApi.getDetail(id)
      formState.value = data
    }

    const onSubmit = () => {
      formRef.value
        .validate()
        .then(async () => {
          const data = toRaw(formState.value)
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

    onMounted(() => {
      getDetail()
    })

    return {
      formRef,
      labelCol: { style: { width: '100px' } },
      formState,
      rules,
      id,
      onSubmit,
      resetForm,
    }
  },
})
</script>