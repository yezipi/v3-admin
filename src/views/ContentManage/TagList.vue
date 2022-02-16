<script lang="ts" setup>
import { reactive, ref } from 'vue'
import TagsApi from '@/api/tags'
import confirm from '@/utils/confirm'

const columns = reactive([
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '排序',
    dataIndex: 'sort',
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
  confirm(`确定删除【${item.name}】吗？`, async () => {
    await TagsApi.destory(item.id)
    initList()
  })
}

const initList = () => {
  tableRef.value.init()
}

</script>

<template>
  <div class="page-list">
    <yzp-table :columns="columns" ref="tableRef" url="Tags.getList">
      <template #filter>
        <div></div>
        <a-button type="primary" @click="toCreate">+ 创建标签</a-button>
      </template>

      <template #cell="{ scope: { record, column } }">
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

