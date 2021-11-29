<template>
  <div class="page-list">

    <yzp-table :columns="columns" ref="tableRef" url="Mood.getList">

      <template #filter>
        <div></div>
        <a-button type="primary" @click="toCreate">+ 发布微语</a-button>
      </template>

      <template #content="{ scope }">
        <span v-if="scope.record.content.indexOf('<img') > -1" style="color: red">【图】</span>
        <a>
          {{ scope.record.content.replace(/(<([^>]+)>)/ig, '').substring(0, 30) + '...' }}
        </a>
      </template>

      <template #action="{ scope }">
        <span>
          <a @click="toEdit(scope.record.id)">编辑</a>
          <a-divider type="vertical" />
          <a @click="confirmDelete(scope.record)">删除</a>
        </span>
      </template>
    </yzp-table>

  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import MoodApi from '@/api/mood'
import confirm from '@/utils/confirm'

export default defineComponent({
  setup() {
    const columns = reactive([
      {
        title: '内容',
        dataIndex: 'content',
        slots: { customRender: 'content' },
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
        title: '状态',
        dataIndex: 'status',
        dict: {
          false: '隐藏',
          true: '显示'
        },
      },
      {
        title: '时间',
        dataIndex: 'createdAt',
        width: 200,
        format: 'YYYY-MM-DD'
      },
      {
        title: '操作',
        key: 'action',
        width: 200,
        slots: { customRender: 'action' },
      },
    ])

    const tableRef = ref()
    const Router = useRouter()

    const toEdit = (id: string) => {
      Router.push({ name: 'MoodEdit', query: { id } })
    }

    const toCreate = () => {
      Router.push({ name: 'MoodAdd' })
    }

    // 删除
    const confirmDelete = (item: any) => {
      confirm(`确定删除这条微语吗？`, async () => {
        await MoodApi.destory(item.id)
        initList()
      })
    }

    const initList = () => {
      tableRef.value.init()
    }

    return {
      columns,
      tableRef,
      confirmDelete,
      toEdit,
      toCreate,
    }
  }
})
</script>
