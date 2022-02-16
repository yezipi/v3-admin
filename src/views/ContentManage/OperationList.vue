<script lang="ts" setup>
import { reactive, ref } from 'vue'
// import TagsApi from '@/api/tags'
// import confirm from '@/utils/confirm'

const columns = reactive([
  {
    title: '行为',
    dataIndex: 'description',
  },
  {
    title: '用户',
    dataIndex: 'user_name',
  },
  {
    title: '地点',
    dataIndex: 'address',
  },
  {
    title: 'ip',
    dataIndex: 'ip',
  },
  {
    title: '设备',
    dataIndex: 'ua',
  },
  {
    title: '时间',
    dataIndex: 'createdAt',
    format: 'YYYY-MM-DD'
  },
  {
    title: '操作',
    dataIndex: 'action',
  },
])

const tableRef = ref()

// 删除
const confirmDelete = (item: any) => {
  // confirm(`确定删除【${item.name}】吗？`, async () => {
  //   await TagsApi.destory(item.id)
  //   initList()
  // })
}

const initList = () => {
  tableRef.value.init()
}

</script>

<template>
  <div class="page-list">
    <yzp-table :columns="columns" ref="tableRef" url="Report.getOperationLogs">
      <template #cell="{ scope: { record, column } }">
        <span v-if="column.dataIndex === 'address'">
          {{ record.province + record.city }}
        </span>
        <span v-if="column.dataIndex === 'action'">
          <a @click="confirmDelete(record)">删除</a>
        </span>
      </template>
    </yzp-table>
  </div>
</template>

