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

      <template #title="{ scope }">
        <a>{{ scope.record }}</a>
      </template>

      <template #status="{ scope }">
        <a-switch :checked="scope.record.status" @change="changeStatus(scope.record, $event)" />
      </template>

      <template #created_at="{ scope }">
        <span>{{ formatDate(scope.record.created_at, 'YYYY-MM-DD hh:mm') }}</span>
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
import { defineComponent, reactive, ref, toRaw, watch } from 'vue'
import { useRouter } from 'vue-router'
import { EditOutlined } from '@ant-design/icons-vue'
import { formatDate } from '@/utils/index'
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
        title: '标题',
        dataIndex: 'title',
        width: 400,
        slots: { customRender: 'title' },
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
        title: '标签',
        dataIndex: 'tags',
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
        slots: { customRender: 'created_at' },
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

    // 隐藏显示
    const changeStatus = async (item: any, checked: boolean) => {
      const { status, id } = item
      try {
        await ArticleApi.update(id, { status: checked })
        item.status = checked
      } catch (e) {
        item.status = !status
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
      changeStatus,
      confirmDelete,
      onSearch,
      toCreate,
      toEdit,
      formatDate,
    }
  }
})
</script>

<style lang="less" scoped>
.filter-left {
  display: flex;
}
</style>