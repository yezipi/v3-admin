<template>
  <div class="page-list">

    <yzp-table :columns="columns" ref="tableRef" url="Article.getList">
      
      <template #filter>
        <a-form :model="condition" class="filter-left">
          <div class="column-select" style="margin-right: 10px">
            <column-select
              v-model:value="condition.subcolumn_id"
              type="article"
              style="width: 200px;"
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

      <template #status="{ scope }">
        <a-switch :checked="scope.record.status" @change="onStatusChange(scope.record, $event)" />
      </template>

      <template #created_at="{ scope }">
        <span>{{ formatDate(scope.record.created_at, 'YYYY-MM-DD hh:mm') }}</span>
      </template>

      <template #action="{ scope }">
        <span>
          <a @click="toEdit(scope.record.id)">编辑</a>
          <a-divider type="vertical" />
          <a @click="confirmDelete(scope.record.id)">删除</a>
        </span>
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
import { formatDate } from '@/utils/index'

export default defineComponent({
  components: { EditOutlined },
  setup() {
    const columns = reactive([
      {
        title: '标题',
        dataIndex: 'title',
        width: 400,
      },
      {
        title: '评论',
        dataIndex: 'comments',
      },
      {
        title: '浏览',
        dataIndex: 'view',
      },
      {
        title: '点赞',
        dataIndex: 'like',
      },
      {
        title: '状态',
        dataIndex: 'status',
        slots: { customRender: 'status' },
      },
      {
        title: '时间',
        dataIndex: 'created_at',
        slots: { customRender: 'created_at' },
      },
      {
        title: '操作',
        key: 'action',
        slots: { customRender: 'action' },
      },
    ])

    const tableRef = ref() 

    const router = useRouter()

    const condition = reactive({
      subcolumn_id: '',
      title: ''
    })

    // 隐藏显示
    const onStatusChange = async ({ status, id }: { status: boolean, id: string }, checked: boolean) => {
      if (status === checked) {
        return
      }
      try {
        await ArticleApi.update(id, { status: checked })
      } catch (e) {
        status = !status
      }
    }

    const toCreate = () => {
      router.push('/article/edit')
    }

    const toEdit = (id: string) => {
      router.push('/article/edit?id=' + id)
    }

    const onSearch = (res: string) => {
      condition.title = res
      console.log(tableRef.value)
      tableRef.value.init(toRaw(condition))
    }

    // 删除
    const confirmDelete = (id: string) => {
      confirm('确定删除该文章吗？', async () => {
        await ArticleApi.destory(id)
      })
    }

    return {
      columns,
      condition,
      tableRef,
      onStatusChange,
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