
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import ChangeLogs from '@/api/changeLogs'
import confirm from '@/utils/confirm'

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

const logType = {
  add: 'green',
  fix: 'red',
  update: 'cyan',
  delete: 'orange'
}

const logLabel = {
  add: '新增',
  fix: '修复',
  update: '优化',
  delete: '删除'
}

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
</script>

<template>
  <div class="page-list">
    <yzp-table :columns="columns" ref="tableRef" url="ChangeLogs.getList" :center="false">
      <template #filter>
        <div></div>
        <a-button type="primary" @click="toCreate">+ 添加版本</a-button>
      </template>

      <template #bodyCell="{ scope: { record, column } }">
        <template v-if="column.dataIndex === 'content'">
          <div v-for="(item, index) in record.content" :index="index" class="yzp-logs-item">
            <a-tag :color="logType[item.type as keyof typeof logType]">{{ logLabel[item.type as keyof typeof logType] }}</a-tag>
            <span>{{ item.text }}</span>
          </div>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <a @click="toEdit(record.id)">编辑</a>
          <a-divider type="vertical" />
          <a @click="confirmDelete(record)">删除</a>
        </template>
      </template>
    </yzp-table>

    <change-logs-edit v-model:visible="drawVisible" :id="currId" @finish="initList"></change-logs-edit>
  </div>
</template>

<style scoped lang="less">
.yzp-logs-item {
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
