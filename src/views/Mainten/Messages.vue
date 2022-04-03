<script lang="ts" setup>
import { reactive, ref } from 'vue'
import MessageApi from '@/api/message'
import confirm from '@/utils/confirm'

const columns = reactive([
  {
    title: '标题',
    dataIndex: 'title',
    width: 500,
  },
  {
    title: '内容',
    dataIndex: 'content',
  },
  {
    title: '类型',
    dataIndex: 'type',
  },
  {
    title: '状态',
    dataIndex: 'read',
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

const initList = () => {
  tableRef.value.init()
  MessageApi.getUnRead()
}

// 删除
const confirmDelete = (item: any) => {
  confirm(`确定删除这条消息吗？`, async () => {
    await MessageApi.destory(item.id)
    initList()
  })
}

const setRead = async (record: any) => {
  await MessageApi.setRead(record.id)
  initList()
}
</script>

<template>
  <div class="page-list">
    <yzp-table :columns="columns" ref="tableRef" url="Message.getList">
      <template #bodyCell="{ scope: { record, column } }">
        <template v-if="column.dataIndex === 'title'">
          <span>{{ record.nickname + record.preffix + record.title }}</span>
        </template>
        <template v-if="column.dataIndex === 'read'">
          <span v-if="record.read" style="color: #999999;">已读</span>
          <span v-else style="color: forestgreen">未读</span>
        </template>
        <template v-if="column.dataIndex === 'type'">
          <a-tag v-if="record.type === 'comment'" color="red">评论</a-tag>
          <a-tag v-if="record.type === 'feedback'" color="cyan">留言</a-tag>
          <a-tag v-if="record.type === 'blogroll'" color="orange">友链</a-tag>
        </template>
        <div v-if="column.dataIndex === 'action'">
          <template v-if="!record.read">
            <a @click="setRead(record)">标记为已读</a>
            <a-divider type="vertical" />
          </template>
          <a @click="confirmDelete(record)">删除</a>
        </div>
      </template>
    </yzp-table>
  </div>
</template>
