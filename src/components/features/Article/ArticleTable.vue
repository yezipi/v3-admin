<template>
  <div class="page-list">
    <yzp-table :columns="columns" :condition="condition" :scroll-width="true" ref="tableRef" url="Article.getList">
      <template #filter>
        <a-form :model="condition" class="filter-left" style="display: flex">
          <column-select v-model:value="condition.subcolumn_id" :type="type" style="margin-right: 10px;width: 300px"></column-select>
          <a-input-search v-model:value="condition.title" placeholder="请输入关键字" enter-button @search="onSearch" style="width: 300px" />
        </a-form>
        <a-button type="primary" @click="toCreate">
          <template #icon>
            <EditOutlined />
          </template>
          创建文章
        </a-button>
      </template>

      <template v-slot:bodyCell="{ scope: { record, column: { dataIndex } } }">
        
        <template v-if="dataIndex === 'cover'">
          <img :src="record.cover || defaultPic" style="width: 100px;object-fit: cover" />
        </template>

        <template v-if="dataIndex === 'title'">
          <span v-if="record.recommend" style="color: rgb(0, 183, 255)">【推荐】</span>
          <span v-if="record.top" style="color: red">【置顶】</span>
          <a>{{ record.title }}</a>
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
            >
              {{ sub }}
            </a-tag>
          </div>
          <span v-else>-</span>
        </template>

        <template v-if="dataIndex === 'recommend'">
          <a-switch :checked="record.recommend" @change="updateArticle(record, $event, 'recommend')" />
        </template>

         <template v-if="dataIndex === 'lock'">
          <a-switch :checked="record.lock" @change="updateArticle(record, $event, 'lock')" />
        </template>

        <template v-if="dataIndex === 'status'">
          <a-switch :checked="record.status" :checkedValue="1" :unCheckedValue="0" checked-children="显示" un-checked-children="隐藏" @change="updateArticle(record, $event, 'status')" />
        </template>

        <template v-if="dataIndex === 'action'">
          <a @click="toEdit(record.id)">编辑</a>
          <a-divider type="vertical" />
          <a @click="confirmDelete(record)">删除</a>
        </template>

      </template>
      
    </yzp-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import { EditOutlined } from '@ant-design/icons-vue'
import ArticleApi from '@/api/article'
import confirm from '@/utils/confirm'

export default defineComponent({
  components: { EditOutlined },
  props: {
    type: {
      type: String,
      default: ''
    },
  },
  setup(props) {
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
        title: '是否私密',
        dataIndex: 'lock',
        width: 100,
        noTransform: true,
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
        width: 100,
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
    const updateArticle = async (item: any, checked: any, key: any) => {
      const { id } = item
      const obj: any = {}
      obj[key] = checked
      try {
        await ArticleApi.update(id, obj)
        item[key] = checked
      } catch (e) {
        item[key] = !checked
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

    return {
      columns,
      condition,
      tableRef,
      defaultPic,
      tagsColors,
      updateArticle,
      confirmDelete,
      onSearch,
      toCreate,
      toEdit,
    }
  }
})
</script>
