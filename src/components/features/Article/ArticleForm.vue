<script lang="ts" setup>
import { ref, toRaw, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import ColumnApi from '@/api/column'
import ArticleApi, { ArticleSaveConfig } from '@/api/article'
import TagsApi from '@/api/tags'

interface ColumnItem {
  name: string,
  id: string,
  alias: string,
  type: string,
  url: string,
  subcolumns: any[]
}

const formRef = ref()
const formState = ref<ArticleSaveConfig>({
  title: '',
  column_id: undefined,
  subcolumn_id: [],
  cover: '',
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
  tags: [],
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
  subcolumn_id: [{ required: true, message: '请选择分类', trigger: 'blur' }]
}

const labelCol = { style: { width: '100px' } }
const columnsFieldNames = { label: 'name', value: 'id', children: 'subcolumns' }

const store = useStore()
const router = useRouter()
const route = useRoute()
const id = route.query.id
const user: any = computed(() => store.state.user)
const tags = ref<any>([])
const columns = ref<ColumnItem[]>([])

// 获取详情
const getDetail = async () => {
  if (!id) {
    return
  }
  const { data } = await ArticleApi.getDetail(id)
  formState.value = { ...data, subcolumn_id: [data.column_id, data.subcolumn_id] }
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

// 获取栏目
const getColumns = async () => {
  const { data } = await ColumnApi.getList({ size: 100, page: 1 })
  const articleCates: any = ['article', 'case'] // 只有这两个个栏目的分类才能作为文章分类
  columns.value = data.rows.filter((e: ColumnItem) => articleCates.includes(e.type))
}

const onSubmit = async () => {
  const columnIds: any = formState.value.subcolumn_id
  const currColumns = columns.value.find((e: ColumnItem) => e.id === columnIds[0])
  await formRef.value.validate()
  if (!formState.value.cover) {
    formState.value.cover = `/public/poster/${parseInt(String(Math.random() * 50))}.jpg`
  }
  const data = {
    ...toRaw(formState.value),
    user_id: user.value.id,
    column_id: columnIds[0],
    subcolumn_id: columnIds[1],
    type: currColumns?.type
  }
  if (!id) {
    await ArticleApi.create(data)
  } else {
    await ArticleApi.update(id, data)
  }
  setTimeout(() => {
    router.push({ name: 'ArticleList' })
  }, 1200)
}

const resetForm = () => {
  formRef.value.resetFields();
}

onMounted(() => {
  getColumns()
  getTags()
  getDetail()
})
</script>

<template>
  <div class="article-form">
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="labelCol"
    >
      <a-form-item label="封面" style="margin-bottom: 15px;">
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

      <a-form-item label="分类" name="subcolumn_id">
        <!-- <column-select v-model:value="formState.subcolumn_id" :type="formState.type" style="width: 100%"></column-select> -->
        <a-cascader v-model:value="formState.subcolumn_id" :options="columns" :field-names="columnsFieldNames" change-on-select placeholder="请选择分类" />
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