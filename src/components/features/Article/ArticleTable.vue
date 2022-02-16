<script lang="ts" setup>
import { reactive, ref, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import { EditOutlined } from '@ant-design/icons-vue'
import { formatDate } from '@/utils/index'
import ArticleApi from '@/api/article'
import confirm from '@/utils/confirm'

const props = defineProps({
  type: {
    type: String,
    default: ''
  },
})

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
    <yzp-table :condition="condition" :scroll-width="true" ref="tableRef" url="Article.getList">
      <template #filter>
        <a-form :model="condition" layout="inline">
          <div class="column-select" style="margin-right: 10px">
            <column-select
              v-model:value="condition.subcolumn_id"
              :type="type"
            ></column-select>
          </div>
          <div>
            <a-input-search
              v-model:value="condition.title"
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

      <template #columns>
        <a-table-column title="封面" data-index="cover" align="center" :width="150">
          <template #cell="{ record }">
            <a-image :width="100" :src="record.cover || defaultPic" />
          </template>
        </a-table-column>
        <a-table-column title="标题" data-index="title" align="center">
          <template #cell="{ record }">
            <div class="yzp-article-title">
              <a-tag v-if="record.recommend" color="#00b42a" style="margin-right: 10px;">推荐</a-tag>
              <a-tag v-if="record.top" color="#f53f3f" style="margin-right: 10px;">置顶</a-tag>
              <a-link>{{ record.title }}</a-link>
            </div>
          </template>
        </a-table-column>
        <a-table-column title="评论" data-index="comments_count" align="center" :width="100"></a-table-column>
        <a-table-column title="浏览" data-index="view" align="center" :width="100"></a-table-column>
        <a-table-column title="点赞" data-index="like" align="center" :width="100"></a-table-column>
        <a-table-column title="分类" data-index="subcolumn" align="center" :width="100">
          <template #cell="{ record }">
            <span v-if="record.subcolumn">{{ record.subcolumn.name }}</span>
            <span v-else style="color: red">分类已删除</span>
          </template>
        </a-table-column>
        <a-table-column title="标签" data-index="tags" align="center">
          <template #cell="{ record }">
            <div v-if="record.tags && record.tags.length">
              <a-tag
                v-for="(sub, idx) in record.tags"
                :key="idx"
                :color="tagsColors[parseInt(String(Math.random() * 7))]"
                class="yzp-article-tags"
              >
                {{ sub }}
              </a-tag>
            </div>
            <span v-else>-</span>
          </template>
        </a-table-column>
        <a-table-column title="推荐" data-index="recommend" align="center" :width="100">
          <template #cell="{ record }">
            <a-switch
              :default-checked="record.recommend"
              @change="updateArticle(record, $event, 'recommend')"
            />
          </template>
        </a-table-column>
        <a-table-column title="状态" data-index="status" align="center" :width="100">
          <template #cell="{ record }">
            <a-switch
              :default-checked="record.status"
              @change="updateArticle(record, $event, 'status')"
            />
          </template>
        </a-table-column>
        <a-table-column title="时间" data-index="created_at" align="center" :width="150">
          <template #cell="{ record }">
            {{ formatDate(record.created_at, 'YYYY-MM-DD hh:mm') }}
          </template>
        </a-table-column>
        <a-table-column title="操作" data-index="action" align="center" :width="150">
          <template #cell="{ record }">
            <a-button @click="toEdit(record.id)" size="mini">编辑</a-button>
            <a-button @click="confirmDelete(record)" size="mini" status="danger" style="margin-left: 10px;">删除</a-button>
          </template>
        </a-table-column>
      </template>
    </yzp-table>
  </div>
</template>

<style lang="less" scoped>
.yzp-article-tags {
  margin-bottom: 10px;
}
.yzp-article-title {
  display: flex;
  align-items: center;
}
.filter-left {
  max-width: 500px;
}
</style>