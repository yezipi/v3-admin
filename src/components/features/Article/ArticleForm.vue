<template>
  <div class="article-form">
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="labelCol"
    >
      <a-form-item label="封面" style="margin-bottom: 12px;">
        <div style="width:150px;height:71px">
          <yzp-upload
            v-model:value="formState.cover"
            :clip="true"
            :thumb="false"
            :width="300"
            :height="170"
            :withParentWith="true"
            dir="cover"
          >
          </yzp-upload>
        </div>
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
        <yzp-editor v-model:value="formState.content"></yzp-editor>
      </a-form-item>

      <a-form-item label="标签">
        <a-select v-model:value="formState.tags" :options="tags" mode="tags" placeholder="请选择标签"></a-select>
      </a-form-item>

      <a-form-item label="来源">
        <a-input v-model:value="formState.from" placeholder="请输入文章来源" />
      </a-form-item>
      
      <a-form-item label="点赞">
        <a-input-number v-model:value="formState.like" placeholder="请输入点赞数" style="width: 100%" />
      </a-form-item>
      
      <a-form-item label="浏览">
        <a-input-number v-model:value="formState.view" placeholder="请输入浏览数" style="width: 100%" />
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
import { defineComponent, ref, toRaw, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import ArticleApi from '@/api/article'
import TagsApi from '@/api/tags'

export default defineComponent({

  setup(props) {
    const formRef = ref();

    let formState= ref({
      title: '',
      subcolumn_id: undefined,
      cover: '',
      cover_origin: '',
      keywords: '',
      description: '',
      content: '',
      from: '',
      like: 0,
      view: 0,
      status: true,
      open_comment: true,
      recommend: false,
      top: false,
      type: 'article',
      tags: []
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

    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const id = route.query.id
    const user: any = computed(() => store.state.user)
    const tags = ref<any>([])

    // 获取详情
    const getDetail = async () => {
      if (!id) {
        return
      }
      const { data } = await ArticleApi.getDetail(id)
      data.subcolumn_id = String(data.subcolumn_id)
      formState.value = data
    }

    // 获取标签
    const getTags = async () => {
      const { data } = await TagsApi.getList({ size: 100, page: 1, loading: false })
      tags.value = data.rows.map((e: any) => {
        return {
          value: e.name,
          label: e.name
        }
      })
    }

    const onSubmit = () => {
      formRef.value
        .validate()
        .then(async () => {
          if (!formState.value.cover) {
            formState.value.cover = `/public/randomImg/${parseInt(String(Math.random() * 50))}.jpg`
          }
          const data = {
            ...toRaw(formState.value),
            user_id: user.value.id
          }
          if (!id) {
            await ArticleApi.create(data)
          } else {
            await ArticleApi.update(id, data)
          }
         setTimeout(() => {
            router.push({ name: 'ArticleList' })
          }, 1200)
        })
    }

    const resetForm = () => {
      formRef.value.resetFields();
    }

    onMounted(() => {
      getDetail()
      getTags()
    })

    return {
      formRef,
      labelCol: { style: { width: '100px' } },
      formState,
      rules,
      id,
      tags,
      onSubmit,
      resetForm,
    }
  },
})
</script>