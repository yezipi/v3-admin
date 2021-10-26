<template>
  <div class="page-list">
    <div class="page-filter">
      <a-form :model="condition" class="filter-left">
        <div class="column-select">
          <column-select v-model:value="condition.subcolumn_id" type="article" style="width: 200px;"></column-select>
        </div>
        <a-input-search
          v-model:value="condition.title"
          placeholder="请输入关键字"
          enter-button
          @search="onSearch"
        />
      </a-form>
      <a-button type="primary" @click="toCreate">
        <template #icon><EditOutlined /></template>
        创建文章
      </a-button>
    </div>
    <a-table
      :dataSource="dataSource"
      :columns="columns"
      :pagination="{ total, pageSize: 10 }"
      rowKey="id"
      size ="middle"
      @change="onPageChange"
    >

      <template #created_at="{ record }">
        <span>{{ record.created_at.substr(0, 10) }}</span>
      </template>

      <template #status="{ record }">
        <a-switch :checked="record.status" @change="onStatusChange(record, $event)" />
      </template>

      <template #action="{ record }">
        <span>
          <a @click="toEdit(record.id)">编辑</a>
          <a-divider type="vertical" />
          <a @click="confirmDelete(record.id)">删除</a>
        </span>
      </template>

    </a-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { EditOutlined } from '@ant-design/icons-vue'
import ArticleApi from '../../api/article'
import confirm from '../../utils/confirm'

export default defineComponent({
  components: { EditOutlined },
  setup() {
    const tableConfig = reactive({
      dataSource: [],
      columns: [
        {
          title: '标题',
          dataIndex: 'title',
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
      ],
      total: 0,
      current: 1
    })

    const router = useRouter()

    const condition = reactive({
      subcolumn_id: '',
      title: ''
    })

    // 获取列表
    const getList = async () => {
      const page = tableConfig.current
      const { data: { rows, count } } = await ArticleApi.getList({ page, ...condition })
      tableConfig.dataSource = rows
      tableConfig.total = count
    }

    // 分页
    const onPageChange = (e: { current: number }) => {
      tableConfig.current = e.current
      getList()
    }

    // 隐藏显示
    const onStatusChange = async ({ status, id }: { status: boolean, id: string }, checked: boolean) => {
      if (status === checked) {
        return
      }
      try {
        await ArticleApi.update(id, { status: checked })
        getList()
      } catch (e) {
        status = !status
      }
    }

    const toCreate = () => {
      router.push('/ArticleEdit')
    }

    const toEdit = (id: string) => {
      router.push('/ArticleEdit?id=' + id)
    }

    const onSearch = (res: string) => {
      condition.title = res
      getList()
    }

    // 删除
    const confirmDelete = (id: string) => {
      confirm('确定删除该文章吗？', async () => {
        await ArticleApi.destory(id)
        getList()
      })
    }

    onMounted(() => {
      getList()
    })

    return {
      ...toRefs(tableConfig),
      condition,
      onPageChange,
      onStatusChange,
      confirmDelete,
      onSearch,
      toCreate,
      toEdit,
    }
  }
})
</script>

<style lang="less" scoped>
.page-filter {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .column-select {
    margin-right: 10px;
  }
  .filter-left, .filter-right {
    display: flex;
    align-items: center;
  }
}
</style>
