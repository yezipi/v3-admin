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

      <template #cover_thumb="{ scope }">
        <div class="article-cover">
          <div class="cover-bg" :style="{ background: `url(${scope.record.cover_thumb || noPicUrl}) center` }"></div>
          <img class="cover-default" :src="noPicUrl" />
        </div>
      </template>

      <template #articleTitle="{ scope }">
        <a class="article-title">
          <span class="at-text">{{ scope.record.title }}</span>
          <span v-if="scope.record.recommend" class="at-recommend">[推荐]</span>
          <span v-if="scope.record.top" class="at-top">[置顶]</span>
        </a>
      </template>

      <template #subcolumn="{ scope }">
        <span v-if="scope.record.subcolumn">{{ scope.record.subcolumn.name }}</span>
        <span v-else style="color: red">分类已删除</span>
      </template>

      <template #tags="{ scope }">
        <div v-if="scope.record.tags">
          <a-tag
            v-for="(sub, idx) in scope.record.tags.split(',')"
            :key="idx"
            :color="tagsColors[parseInt(String(Math.random() * 7))]"
          >
            {{ sub }}
          </a-tag>
        </div>
        <span v-else>-</span>
      </template>

      <template #recommend="{ scope }">
        <a-switch :checked="scope.record.recommend" @change="updateArticle(scope.record, $event, 'recommend')" />
      </template>

      <template #status="{ scope }">
        <a-switch :checked="scope.record.status" @change="updateArticle(scope.record, $event, 'status')" />
      </template>

      <template #action="{ scope }">
        <a @click="toEdit(scope.record.id)">编辑</a>
        <a-divider type="vertical" />
        <a @click="confirmDelete(scope.record.id)">删除</a>
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
        dataIndex: 'cover_thumb',
        width: 100,
        slots: { customRender: 'cover_thumb' },
      },
      {
        title: '标题',
        dataIndex: 'title',
        width: 300,
        slots: { customRender: 'articleTitle' },
      },
      {
        title: '评论',
        dataIndex: 'comments',
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
        slots: { customRender: 'subcolumn' },
      },
      {
        title: '标签',
        dataIndex: 'tags',
        width: 200,
        slots: { customRender: 'tags' },
      },
      {
        title: '推荐',
        dataIndex: 'recommend',
        slots: { customRender: 'recommend' },
        width: 100,
      },
      {
        title: '状态',
        dataIndex: 'status',
        slots: { customRender: 'status' },
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
        key: 'action',
        width: 100,
        slots: { customRender: 'action' },
      },
    ])
    
    const tableRef = ref() 
    const router = useRouter()
    const condition = reactive({
      subcolumn_id: undefined,
      title: undefined as any,
      type: props.type
    })
    const noPicUrl = '/src/assets/img/nopic.jpg'
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
    const confirmDelete = (id: string) => {
      confirm('确定删除该文章吗？', async () => {
        await ArticleApi.destory(id)
        onSearch()
      })
    }

    return {
      columns,
      condition,
      tableRef,
      noPicUrl,
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
    color: #ff9100;
  }
  .at-top {
    color: red;
  }
}
</style>