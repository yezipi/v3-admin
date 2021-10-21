<template>
  <div class="page-list">
    <div class="page-filter">
      <div class="filter-left">
        <column-select></column-select>
      </div>
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
          <a>编辑</a>
          <a-divider type="vertical" />
          <a @click="confirmDelete(record.id)">删除</a>
        </span>
      </template>

    </a-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import ArticleApi from '../../api/article'
import confirm from '../../utils/confirm'

export default defineComponent({
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
    const filter = reactive({
      subcolumn_id: '',
      title: ''
    })
    // 获取列表
    const getList = async () => {
      const page = tableConfig.current
      const { data: { rows, count } } = await ArticleApi.getList({ page })
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
      filter,
      onPageChange,
      onStatusChange,
      confirmDelete
    }
  }
})
</script>

