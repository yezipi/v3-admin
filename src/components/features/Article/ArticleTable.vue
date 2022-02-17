<script lang="ts" setup>
import { reactive, ref, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import { EditOutlined } from '@ant-design/icons-vue'
import ArticleApi from '@/api/article'
import confirm from '@/utils/confirm'

const props = defineProps({
  type: {
    type: String,
    default: ''
  },
})

const columns = reactive([
  {
    title: '封面',
    dataIndex: 'cover',
    width: 120,
  },
  {
    title: '标题',
    dataIndex: 'title',
    width: 300,
  },
  {
    title: '评论',
    dataIndex: 'comments_count',
    width: 100,
  },
  {
    title: '浏览',
    dataIndex: 'view',
    width: 100,
  },
  {
    title: '点赞',
    dataIndex: 'like',
    width: 100,
  },
  {
    title: '分类',
    dataIndex: 'subcolumn',
    width: 100,
  },
  {
    title: '标签',
    dataIndex: 'tags',
    width: 100,
  },
  {
    title: '推荐',
    dataIndex: 'recommend',
    width: 100,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
  },
  {
    title: '时间',
    dataIndex: 'created_at',
    format: 'YYYY-MM-DD hh:mm',
    width: 150,
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 140,
  },
])

const tableRef = ref()
const router = useRouter()
const condition = reactive({
  subcolumn_id: undefined,
  title: undefined as any,
  type: props.type
})
const defaultPic = '/src/assets/img/nopic.jpg'
const tagsColors = ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple']

// 隐藏显示
const updateArticle = async (item: any, checked: boolean, key: any) => {
  const { id } = item
  const obj: any = {}
  obj[key] = checked
  try {
    await ArticleApi.update(id, obj)
    item[key] = checked
  } catch (e) {
    item[key] = !item[key]
  }
}

const toCreate = () => {
  router.push({ name: 'ArticleAdd' })
}

const toEdit = (id: string) => {
  router.push({
    name: 'ArticleEdit',
    query: { id }
  })
}

const onSearch = (res?: string) => {
  condition.title = res as string
  tableRef.value.init(toRaw(condition))
}

// 删除
const confirmDelete = (item: any) => {
  confirm(`确定删除【${item.title}】吗？`, async () => {
    await ArticleApi.destory(item.id)
    onSearch()
  })
}
</script>

<template>
  <div class="page-list">
    <yzp-table
      :columns="columns"
      :condition="condition"
      :scroll-width="1"
      ref="tableRef"
      url="Article.getList"
    >
      <template #filter>
        <a-form :model="condition" layout="inline">
          <div class="column-select" style="margin-right: 10px">
            <column-select v-model:value="condition.subcolumn_id" :type="type"></column-select>
          </div>
          <div>
            <a-input-search
              v-model="condition.title"
              placeholder="请输入关键字"
              enter-button
              @search="onSearch"
            />
          </div>
        </a-form>
        <a-button type="primary" @click="toCreate">
          <template #icon>
            <EditOutlined />
          </template>
          创建文章
        </a-button>
      </template>

      <template #bodyCell="{ scope: { record, column: { dataIndex } } }">
        <template v-if="dataIndex === 'cover'">
          <div class="article-cover">
            <img :src="record.cover || defaultPic" style="width: 100px;object-fit: cover;" />
          </div>
        </template>

        <template v-if="dataIndex === 'title'">
          <a class="article-title">
            <a-tag v-if="record.recommend" color="green">【推荐】</a-tag>
            <a-tag v-if="record.top" color="cyan">【置顶】</a-tag>
            <a-link>{{ record.title }}</a-link>
          </a>
        </template>

        <template v-if="dataIndex === 'subcolumn'">
          <span v-if="record.subcolumn">{{ record.subcolumn.name }}</span>
          <span v-else style="color: red">分类已删除</span>
        </template>

        <template v-if="dataIndex === 'tags'">
          <div v-if="record.tags && record.tags.length">
            <a-tag
              v-for="(sub, idx) in record.tags"
              :key="idx"
              :color="tagsColors[parseInt(String(Math.random() * 7))]"
              class="yzp-article-tags"
            >{{ sub }}</a-tag>
          </div>
          <span v-else>-</span>
        </template>

        <template v-if="dataIndex === 'recommend'">
          <a-switch :default-checked="record.recommend" @change="updateArticle(record, $event, 'recommend')" />
        </template>

        <template v-if="dataIndex === 'status'">
          <a-switch :default-checked="record.status" @change="updateArticle(record, $event, 'status')" />
        </template>

        <template v-if="dataIndex === 'action'">
          <a-button size="mini" @click="toEdit(record.id)">编辑</a-button>
          <a-button size="mini" status="danger" @click="confirmDelete(record)" style="margin-left: 10px;">删除</a-button>
        </template>
      </template>
    </yzp-table>
  </div>
</template>

<style lang="less" scoped>
.yzp-article-tags {
  margin-bottom: 5px;
  &:last-child {
    margin-bottom: 0;
  }
}
.yzp-article-title {
  display: flex;
  align-items: center;
}
</style>