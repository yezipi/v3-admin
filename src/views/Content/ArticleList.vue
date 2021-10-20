<template>
  <div>
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

      <template #action>
        <span>
          <a>编辑</a>
          <a-divider type="vertical" />
          <a @click="confirmDelete">删除</a>
        </span>
      </template>

    </a-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, createVNode, onMounted, reactive, toRefs } from 'vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal } from 'ant-design-vue';
import ArticleApi from '../../api/article'

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

    const getList = (async () => {
      const page = tableConfig.current
      const { data: { rows, count } } = await ArticleApi.getList({ page })
      tableConfig.dataSource = rows
      tableConfig.total = count
    })

    // 分页
    const onPageChange = ((e: { current: number }) => {
      tableConfig.current = e.current
      getList()
    })

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
    const confirmDelete = () => {
      Modal.confirm({
        title: () => '提示',
        content: () => '确定删除该文章吗',
        okType: 'danger',
        okText: () => '确定',
        cancelText: () => '取消',
        icon: () => createVNode(ExclamationCircleOutlined),
        onOk() {
          console.log('OK');
        },
      });
    }

    onMounted(() => {
      getList()
    })

    return {
      ...toRefs(tableConfig),
      onPageChange,
      onStatusChange,
      confirmDelete
    }
  }
})
</script>

