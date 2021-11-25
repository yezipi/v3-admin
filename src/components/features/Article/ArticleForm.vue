<template>
  <div class="article-form">
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="labelCol"
    >
      <a-form-item label="封面" style="margin-bottom: 0;">
        <yzp-upload
          v-model:value="formState.cover_thumb"
          :thumb="true"
          :clip="true"
          :width="800"
          dir="article_cover"
        >
        </yzp-upload>
      </a-form-item>

      <a-form-item label="类型" name="type">
        <a-radio-group v-model:value="formState.type">
          <a-radio value="article">文章</a-radio>
          <a-radio value="case">案例</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="分类" name="subcolumn_id">
        <column-select v-model:value="formState.subcolumn_id" :type="formState.type" style="width: 100%"></column-select>
      </a-form-item>

      <a-form-item label="标题" name="title">
        <a-input v-model:value="formState.title" :maxlength="50" placeholder="请输入标题" />
      </a-form-item>

      <a-form-item label="关键字" name="keywords" >
        <a-textarea v-model:value="formState.keywords" autoSize :rows="3" placeholder="请输入关键字，英文逗号隔开" />
      </a-form-item>

      <a-form-item label="描述" name="description">
        <a-textarea v-model:value="formState.description" autoSize :rows="3" placeholder="请输入描述" />
      </a-form-item>

      <a-form-item label="正文" name="content" class="maxwidth-100">
        <yzp-editor ref="editor" v-model="formState.content"></yzp-editor>
      </a-form-item>

      <a-form-item label="来源">
        <a-input v-model:value="formState.author_name" placeholder="请输入文章来源" />
      </a-form-item>
      
      <a-form-item label="点赞">
        <a-input v-model:value="formState.like" type="number" placeholder="请输入点赞数" />
      </a-form-item>
      
      <a-form-item label="浏览">
        <a-input v-model:value="formState.view" type="number" placeholder="请输入浏览数" />
      </a-form-item>

      <a-form-item label="设置">
        <a-checkbox v-model:checked="formState.status">显示</a-checkbox>
        <a-checkbox v-model:checked="formState.open_comment">开启评论</a-checkbox>
        <a-checkbox v-model:checked="formState.recommend">设为推荐</a-checkbox>
        <a-checkbox v-model:checked="formState.top">置顶</a-checkbox>
      </a-form-item>
      
      <a-form-item class="btn-label">
        <a-button type="primary" @click="onSubmit">{{ id ? '立即保存' : '立即发布' }}</a-button>
        <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
      </a-form-item>

    </a-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRaw, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import ArticleApi from '@/api/article'


export default defineComponent({

  setup(props) {
    const formRef = ref();

    let formState= ref({
      title: '',
      subcolumn_id: undefined,
      cover_thumb: '',
      cover_origin: '',
      keywords: '',
      description: '',
      content: '',
      author_name: '',
      like: 0,
      view: 0,
      status: true,
      open_comment: true,
      recommend: false,
      top: false,
      type: 'article'
    })

    const rules = {
      title: [
        { required: true, message: '请输入标题', trigger: 'blur' },
        { min: 5, max: 50, message: '至少5个字哦， 最多50个字', trigger: 'blur' },
      ],
      content: [
        { required: true, message: '请输入正文内容', trigger: 'change' },
        { min: 5, message: '正文至少5个字哦', trigger: 'change' },
      ],
      subcolumn_id:[ { required: true, message: '请选择分类', trigger: 'blur' } ]
    };

    const { state } = useStore()
    const router = useRouter()
    const route = useRoute()
    const id = route.query.id

    // 获取详情
    const getDetail = async () => {
      if (!id) {
        return
      }
      const { data } = await ArticleApi.detail(id)
      data.subcolumn_id = String(data.subcolumn_id)
      formState.value = data
    }

    const onSubmit = () => {
      formRef.value
        .validate()
        .then(async () => {
          formState.value.cover_origin = formState.value.cover_thumb.replace('thumb_', 'origin_')
          console.log(toRaw(formState))
          const data = {
            ...toRaw(formState.value),
            user_id: state.user.id
          }
          const msg = id ? '保存成功' : '发布成功'
          if (!id) {
            await ArticleApi.create(data)
          } else {
            await ArticleApi.update(id, data)
          }
          message.success(msg, 1.5, () => {
            router.push({ name: 'ArticleList' })
          })
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
      onSubmit,
      resetForm,
      id,
    }
  },
})
</script>