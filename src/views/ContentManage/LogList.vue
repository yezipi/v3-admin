<template>
  <div class="page-list">

    <yzp-table :columns="columns" ref="tableRef" url="ChangeLogs.getList">

      <template #filter>
        <div></div>
        <a-button type="primary" @click="toCreate">+ 添加更新日志</a-button>
      </template>

      <template #bodyCell="{ scope: { record, column } }">
        <span v-if="column.dataIndex === 'action'">
          <a @click="toEdit(record.id)">编辑</a>
          <a-divider type="vertical" />
          <a @click="confirmDelete(record)">删除</a>
        </span>
      </template>
    </yzp-table>

    <tags-edit v-model:visible="drawVisible" :id="currId" @finish="initList"></tags-edit>

  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import ChangeLogs from '@/api/tags'
import confirm from '@/utils/confirm'

export default defineComponent({
  setup() {
    const columns = reactive([
      {
        title: '更新内容',
        dataIndex: 'content',
      },
      {
        title: '类型',
        dataIndex: 'type',
      },
      {
        title: '时间',
        dataIndex: 'created_at',
        format: 'YYYY-MM-DD'
      },
      {
        title: '操作',
        dataIndex: 'action',
      },
    ])

    const tableRef = ref()
    const currId = ref()
    const drawVisible = ref(false)

    const toEdit = (id: string) => {
      currId.value = id
      drawVisible.value = true
    }

    const toCreate = () => {
      currId.value = ''
      drawVisible.value = true
    }

    // 删除
    const confirmDelete = (item: any) => {
      confirm(`确定删除这条日志吗？`, async () => {
        await ChangeLogs.destory(item.id)
        initList()
      })
    }

    const initList = () => {
      tableRef.value.init()
    }

    return {
      columns,
      tableRef,
      currId,
      drawVisible,
      confirmDelete,
      toEdit,
      toCreate,
      initList,
    }
  }
})
</script>
