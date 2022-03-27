<script lang="ts" setup>
import { reactive, ref } from 'vue'

const columns = reactive([
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '类型',
    dataIndex: 'type',
  },
  {
    title: '时间',
    dataIndex: 'createdAt',
    format: true
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

const initList = () => {
  tableRef.value.init()
}
</script>

<template>
  <div class="yzp-role-page">
    <yzp-table :columns="columns" ref="tableRef" url="Role.getList">
      <template #bodyCell="{ scope: { record, column } }">
        <span v-if="column.dataIndex === 'action'">
          <a @click="toEdit(record.id)">编辑</a>
        </span>
      </template>
    </yzp-table>

    <role-edit v-model:visible="drawVisible" :id="currId" @finish="initList"></role-edit>
  </div>
</template>
