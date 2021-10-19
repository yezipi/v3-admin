<template>
  <div>
    <a-table
      :dataSource="dataSource"
      :columns="columns"
      :pagination="{ total, pageSize: 20 }"
      rowKey="id"
      size ="middle"
    >

      <template #created_at="{ record }">
        <span>{{ record.created_at.substr(0, 10) }}</span>
      </template>

      <template #status="{ record }">
        <a-switch v-model:checked="record.status" />
      </template>

      <template #action>
        <span>
          <a>编辑</a>
          <a-divider type="vertical" />
          <a>删除</a>
        </span>
      </template>

    </a-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { ArticleApi } from '../../api'

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
    })

    const getList = (async () => {
      const { data: { rows, count } } = await ArticleApi.getList()
      tableConfig.dataSource = rows
      tableConfig.total = count
    });

    onMounted(() => {
      getList()
    })

    return {
      ...toRefs(tableConfig)
    }
  }
})
</script>

