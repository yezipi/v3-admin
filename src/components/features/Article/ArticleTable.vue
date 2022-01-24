<template>
  <div class="page-list">
    <yzp-table :columns="columns" :condition="condition" :scroll-width="true" ref="tableRef" url="Article.getList">
      <template #filter>
        <a-form :model="condition" class="filter-left">
          <div class="column-select" style="margin-right: 10px">
            <column-select
              v-model:value="condition.subcolumn_id"
              style="width: 200px;"
              :type="type"
            ></column-select>
          </div>
          <a-input-search
            v-model:value="condition.title"
            placeholder="请输入关键字"
            enter-button
            @search="onSearch"
          />
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
          <div class="article-cover">
            <div class="cover-bg" :style="{ background: `url(${record.cover || defaultPic}) center` }"></div>
            <img class="cover-default" :src="defaultPic" />
          </div>
        </template>

        <template v-if="dataIndex === 'title'">
          <a class="article-title">
            <span v-if="record.recommend" class="at-recommend">【推荐】</span>
            <span v-if="record.top" class="at-top">【置顶】</span>
            <span class="at-text">{{ record.title }}</span>
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
            >
              {{ sub }}
            </a-tag>
          </div>
          <span v-else>-</span>
        </template>

        <template v-if="dataIndex === 'recommend'">
          <a-switch :checked="record.recommend" @change="updateArticle(record, $event, 'recommend')" />
        </template>

        <template v-if="dataIndex === 'status'">
          <a-switch :checked="record.status" @change="updateArticle(record, $event, 'status')" />
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
        width: 100,
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
        width: 200,
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

<style lang="less" scoped>
.filter-left {
  display: flex;
}
.article-cover {
  object-fit: cover;
  height: 38px;
  width: 80px;
  position: relative;
  .cover-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-size: cover!important;
    z-index: 1;
  }
  .cover-default {
    width: 100%;
    height: 100%;
  }
}
.article-title {
  .at-recommend {
    color: red;
  }
  .at-top {
    color: rgb(69, 184, 3);
  }
}
</style>