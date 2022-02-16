<template>
  <div class="page-list">

    <yzp-table :columns="columns" ref="tableRef" url="ChangeLogs.getList">

      <template #filter>
        <div></div>
        <a-button type="primary" @click="toCreate">+ 添加版本</a-button>
      </template>

      <template #columns="{ scope: { record, column } }">
        <span v-if="column.dataIndex === 'action'">
          <a @click="toEdit(record.id)">编辑</a>
          <a-divider direction ="vertical" />
          <a @click="confirmDelete(record)">删除</a>
        </span>
      </template>
    </yzp-table>

    <change-logs-edit v-model:visible="drawVisible" :id="currId" @finish="initList"></change-logs-edit>

  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import ChangeLogs from '@/api/changeLogs'
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
        dataIndex: 'version',
      },
      {
        title: '时间',
        dataIndex: 'createdAt',
        format: 'YYYY-MM-DD hh:mm'
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
